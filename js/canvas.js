const COLORS = ['#8b7cff','#ff7b91','#5fc9b5','#f5bd66','#75a9ff'];
export class BoardCanvas {
  constructor(containerId, wrapId) {
    this.wrap = document.getElementById(wrapId); this.selected = null; this.mode = 'select';
    this.stage = new Konva.Stage({container: containerId, width: this.wrap.clientWidth, height: this.wrap.clientHeight, draggable: false});
    this.layers = new Map(); this.onSelection = () => {};
    this.addLayer('Background', {locked:true}); this.addLayer('Map'); this.addLayer('Characters'); this.addLayer('Objects');
    this.stage.on('click tap', e => { if (e.target === this.stage) this.select(null); });
    this.stage.on('wheel', e => { e.evt.preventDefault(); this.zoom(e.evt.deltaY > 0 ? .92 : 1.08); });
    new ResizeObserver(() => this.resize()).observe(this.wrap);
    this.load();
    this.wrap.addEventListener('dragover', e => e.preventDefault());
    this.wrap.addEventListener('drop', e => { e.preventDefault(); const data=e.dataTransfer.getData('application/walkthrough'); if(data){const r=this.wrap.getBoundingClientRect();this.addToken(JSON.parse(data),{x:e.clientX-r.left,y:e.clientY-r.top});}});
  }
  addLayer(name, opts={}) { const layer = new Konva.Layer({name}); layer.visible(opts.visible !== false); layer.listening(!opts.locked); this.stage.add(layer); this.layers.set(name, {layer, locked:!!opts.locked}); return layer; }
  getLayer(name='Characters') { return this.layers.get(name)?.layer || this.stage.findOne('.Characters'); }
  addToken(data={label:'Hero', color:COLORS[0], type:'character'}, pos={x:this.stage.width()/2,y:this.stage.height()/2}) { const layer=this.getLayer(data.type==='object'?'Objects':'Characters'); const group=new Konva.Group({x:pos.x,y:pos.y,draggable:true,name:data.label||'Token'}); const shape=new Konva.Circle({radius:34,fill:data.color||COLORS[0],stroke:'#fff',strokeWidth:2,shadowColor:'#000',shadowBlur:8,shadowOpacity:.5}); const text=new Konva.Text({text:data.label||'Token',fontSize:11,fill:'#fff',width:90,offsetX:45,align:'center',y:42}); group.add(shape,text); this.bind(group); layer.add(group); layer.draw(); this.select(group); this.save(); return group; }
  addImage(src, name='Image', pos={x:this.stage.width()/2,y:this.stage.height()/2}) { const imageObj=new Image(); imageObj.onload=()=>{const layer=this.getLayer('Objects'); const ratio=Math.min(120/imageObj.width,120/imageObj.height,1); const image=new Konva.Image({image:imageObj,x:pos.x,y:pos.y,width:imageObj.width*ratio,height:imageObj.height*ratio,offsetX:imageObj.width*ratio/2,offsetY:imageObj.height*ratio/2,draggable:true,name}); this.bind(image);layer.add(image);layer.draw();this.select(image);this.save();}; imageObj.src=src; }
  bind(node) { node.on('click tap', e => {e.cancelBubble=true; if(this.mode==='select') this.select(node);}); node.on('dragend',()=>this.save()); }
  select(node) { if(this.selected) this.selected.strokeWidth?.(2); this.selected=node; if(node) node.strokeWidth?.(4); this.onSelection(node); this.stage.draw(); }
  deleteSelected(){if(this.selected){this.selected.destroy();this.selected=null;this.onSelection(null);this.stage.draw();this.save();}}
  duplicateSelected(){if(!this.selected)return;const n=this.selected.clone({x:this.selected.x()+20,y:this.selected.y()+20});this.bind(n);this.selected.getLayer().add(n);this.select(n);this.save();}
  resizeSelected(size){if(this.selected){const factor=size/(this.selected.width()||1);this.selected.scale({x:factor,y:factor});this.stage.draw();this.save();}}
  rotateSelected(deg){if(this.selected){this.selected.rotation(deg);this.stage.draw();this.save();}}
  setMode(mode){this.mode=mode;this.stage.draggable(mode==='pan');this.stage.find('Group,Image').forEach(n=>n.draggable(mode==='select'));}
  zoom(factor){const old=this.stage.scaleX(), next=Math.max(.35,Math.min(2.5,old*factor));const center={x:this.stage.width()/2,y:this.stage.height()/2};const point={x:(center.x-this.stage.x())/old,y:(center.y-this.stage.y())/old};this.stage.scale({x:next,y:next});this.stage.position({x:center.x-point.x*next,y:center.y-point.y*next});document.getElementById('zoomLabel').textContent=Math.round(next*100)+'%';this.stage.batchDraw();}
  fit(){this.stage.position({x:0,y:0});this.stage.scale({x:1,y:1});document.getElementById('zoomLabel').textContent='100%';this.stage.batchDraw();}
  resize(){this.stage.size({width:this.wrap.clientWidth,height:this.wrap.clientHeight});this.stage.batchDraw();}
  save(){const items=[];this.stage.find('Group,Image').each(n=>items.push({name:n.name(),x:n.x(),y:n.y(),rotation:n.rotation(),scaleX:n.scaleX(),scaleY:n.scaleY(),type:n.className}));localStorage.setItem('walkthrough-board',JSON.stringify(items));document.getElementById('saveStatus').textContent='Saved locally';}
  load(){try{const items=JSON.parse(localStorage.getItem('walkthrough-board')||'[]');items.forEach(i=>i.type==='Group'?this.addToken({label:i.name,color:'#8b7cff'},{x:i.x,y:i.y}):null);}catch(e){console.warn(e)}}
}
