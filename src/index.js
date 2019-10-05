import * as Pixi from 'pixi.js';

let main = null;
let app = null;
let IM = null;

document.addEventListener('DOMContentLoaded', ()=>{
  console.log('document loaded...');
  main = document.getElementById('main');
});

window.addEventListener('load', ()=>{
  console.log('window loaded...');


  app = new Pixi.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
  });
  IM = app.renderer.plugins.interaction;
  //console.dir('im:', IM);

  IM.on('pointerdown', globalWatch);
  IM.on('pointerup', globalWatch);
  //IM.on('pointermove', globalWatch);

  main.append(app.view);


  const circle = new Pixi.Graphics();
  circle.interactive = true;
  circle.__id = 'foobar';
  circle
    .beginFill(0xff5555)
    .drawCircle(300,300,100)
    .endFill();

  //circle.on('mouseover', handleMouseOver);


  app.stage.addChild(circle);
});

const handleMouseOver = (event) => {
  console.log('hmo', event);
};


const globalWatch = event => {
  const result = IM.hitTest(event.data.global, app.stage);
  console.log('result:', result);
  console.log('event type:', event.type);
}
