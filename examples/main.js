import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-editable'
import {ScaledRectangleEditor} from '@/editor'

const features = L.layerGroup();
const options = {
  editable: true,
  editOptions: {
    rectangleEditorClass: ScaledRectangleEditor,
    featuresLayer: features
  }
}
const map = L.map('map', options);
map.setView([52.5069,13.4298], 15);
features.addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  detectRetina: true,
  attribution: 'Tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> '
}).addTo(map);

const RectangleControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd(map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');

        const link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.innerHTML = '⬛'

        L.DomEvent.on(link, 'click', L.DomEvent.stop)
                  .on(link, 'click', () => {
                    const input = document.getElementById('ratioInput')
                    const layer  = map.editTools.startRectangle.call(map.editTools);
                    layer.editor.ratio = parseFloat(input.value);
                  });

        return container;
    }
});
map.addControl(new RectangleControl());

const RatioControl = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd(map) {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        container.style = "background-color: white; padding: 0px 2px";

        const label = L.DomUtil.create('label', '', container);
        label.innerHTML = 'Ratio'

        const input = L.DomUtil.create('input', '', container);
        input.id = 'ratioInput';
        input.type = 'number';
        input.step= '0.01';
        input.style = "width: 50px; height: 30px; text-align: center; border: 0px";
        input.value = 1;
        input.min = 0;

        L.DomEvent.on(input, 'input', L.DomEvent.stop)
                  .on(input, 'input', (e) => {
                      features.eachLayer(function (layer) {
                          if (layer.editor) {
                            layer.editor.ratio = parseFloat(input.value)
                            layer.editor.extendBounds()
                          }
                      });
                  })

        return container;
    }
});
map.addControl(new RatioControl());
