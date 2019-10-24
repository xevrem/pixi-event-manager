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

  const tracker = new InteractionTracker(app.renderer.plugins.interaction);

  main.append(app.view);


  const circle = new Pixi.Graphics();
  circle.interactive = true;
  circle.__id = 'foo';
  circle
    .beginFill(0xff5555)
    .drawCircle(200,200,100)
    .endFill();


  const rect = new Pixi.Graphics();
  rect.interactive = true;
  rect.__id = 'bar';
  rect
    .beginFill(0xffff55)
    .drawRect(400,400, 100, 100)
    .endFill();



  app.stage.addChild(circle);
  app.stage.addChild(rect);
});


const InteractionData = (id) => ({
  id
});

class InteractionTracker {
  constructor(interactionManager, stage){
    //hook into the IM
    this.__IM = interactionManager;
    this.__IM.on('pointerdown', this.globalWatch, {context:this, event:'pointerdown'});
    this.__IM.on('pointerup', this.globalWatch, {context:this, event:'pointerup'});
    this.__IM.on('pointermove', this.globalWatch, {context:this, event:'pointermove'});
    this.__IM.on('pointerover', this.globalWatch, {context:this, event:'pointerover'});
    this.__IM.on('pointerout', this.globalWatch, {context:this, event:'pointerout'});

    this.__stage = stage;
    this.__interactions = {
      stage: InteractionData('stage')
    };
    this.__lastInteractive = null;
  }

  globalWatch(event){
    // test to see if there is anything here
    const result = this.context.__IM.hitTest(event.data.global, this.context.__stage);
    this.context.update(event, result, this.event);
    console.log('gw', this.context.__interactions);
  };


  update(event, entity, baseEvent){
    if(entity){
      // this is a DisplayObject
      if(!this.__interactions.hasOwnProperty(entity.__id)){
        this.__interactions[entity.__id] = InteractionData(entity.__id);
      }
      // flag the event as having occurred
      this.__interactions[entity.__id][baseEvent] = event.type;
    }else{
      // this is the stage
      this.__interactions.stage[baseEvent] = event.type;
    }
    this.__lastInteractive = entity;
  }

  get interactions(){
    return this.__interactions;
  }
}
