import { BoardCanvas } from './canvas.js';
import { LayerManager } from './layers.js';
import { AssetLibrary } from './assets.js';

const $ = (id) => document.getElementById(id);
const canvas = new BoardCanvas('stage', 'canvasWrap');
const layers = new LayerManager($('layerList'), canvas);
const assets = new AssetLibrary($('assetGrid'), canvas);
canvas.onSelection = (node) => {
  $('selectionName').textContent = node ? (node.name() || 'Tabletop item') : 'Nothing selected';
  if (node) { $('sizeControl').value = node.width(); $('rotationControl').value = node.rotation(); }
};
assets.seed();
layers.render();

$('selectTool').onclick = () => { canvas.setMode('select'); $('selectTool').classList.add('active'); $('panTool').classList.remove('active'); };
$('panTool').onclick = () => { canvas.setMode('pan'); $('panTool').classList.add('active'); $('selectTool').classList.remove('active'); };
$('zoomIn').onclick = () => canvas.zoom(1.15); $('zoomOut').onclick = () => canvas.zoom(.87); $('fitBoard').onclick = () => canvas.fit();
$('gridToggle').onclick = () => document.querySelector('.canvas-wrap').classList.toggle('grid-off');
$('deleteSelected').onclick = () => canvas.deleteSelected();
$('duplicateSelected').onclick = () => canvas.duplicateSelected();
$('newLayer').onclick = () => { const name = prompt('Layer name', 'New layer'); if (name) layers.add(name); };
$('sizeControl').oninput = (e) => canvas.resizeSelected(+e.target.value);
$('rotationControl').oninput = (e) => canvas.rotateSelected(+e.target.value);
$('resetBoard').onclick = () => { if(confirm('Clear the tabletop and restore default layers?')) { localStorage.removeItem('walkthrough-board'); location.reload(); } };
document.querySelectorAll('[data-open]').forEach(b => b.onclick = () => $(b.dataset.open).classList.add('open'));
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => $(b.dataset.close).classList.remove('open'));
$('imageUpload').onchange = (e) => [...e.target.files].forEach(file => assets.addUpload(file));
window.addEventListener('beforeunload', () => canvas.save());
