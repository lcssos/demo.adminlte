import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {environment} from '../../environments/environment';

declare var OpenSeadragon: any;

@Component({
  selector: 'app-openslide',
  templateUrl: './openslide.component.html',
  styleUrls: ['./openslide.component.css']
})
export class OpenslideComponent implements OnInit, OnDestroy {

  id: string;
  private sub: any;

  constructor(private route: ActivatedRoute) { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    require('./static/openseadragon.js');
    require('./static/openseadragon-scalebar.js');
    require('./static/openseadragon-hhtile.js');

    // console.log('ng init');



    let viewer = new OpenSeadragon({
      id: "view",
      prefixUrl: "/assets/openslide/",
      timeout: 120000,
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomLevel: 1,
      visibilityRatio: 1,
      zoomPerScroll: 2,
      showNavigator: true,
      navigatorPosition: "ABSOLUTE",
      navigatorTop:      "30px",
      navigatorLeft:     "4px",
      navigatorHeight:   "120px",
      navigatorWidth:    "145px",
      navigatorAutoFade:  false,
    });


    // $(".load-slide").click(function(ev) {
    //   console.log('load-slide click')
    //   $(".current-slide").removeClass("current-slide");
    //   $(this).parent().addClass("current-slide");
    //   open_slide($(this).attr('data-url'),parseFloat($(this).attr('data-mpp')), viewer);
    //   ev.preventDefault();
    // });


    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];


      viewer.addHandler("open", function() {
        viewer.source.minLevel = 9;
      });
      viewer.scalebar({
        // xOffset: 10,
        // yOffset: 10,
        barThickness: 1,
        // color: '#555555',
        color: '#00FF00',
        fontColor: '#00FF00',
        // backgroundColor: 'rgba(255, 255, 255, 0.5)',
        pixelsPerMeter: 10000000,
        location: 4,
      });


      let slide_url = environment.remoteAddress + '/slide_dzi/'+this.id;
      open_slide(slide_url, parseFloat('0'),viewer);
    });


  }



}


function open_slide(url, mpp,viewer) {
  // var tile_source;
  // if (dzi_data11[url]) {
  //   // DZI XML provided as template argument (deepzoom_tile.py)
  //   tile_source = new OpenSeadragon.DziTileSource(
  //     OpenSeadragon.DziTileSource.prototype.configure(
  //       OpenSeadragon.parseXml(dzi_data11[url]), url));
  // } else {
  //   // DZI XML fetched from server (deepzoom_server.py)
  //   tile_source = url;
  // }
  // viewer.open(tile_source);
  viewer.open(url);
  // console.log('mpp');
  // console.log(mpp);
  // viewer.scalebar({
  //   // pixelsPerMeter: mpp ? (1e6 / mpp) : 0,
  // });
}
