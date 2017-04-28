import { Component} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.html',
})
export class AppComponent  { 

	genes:Gene[];
	svgItems:Block[];
	maxLen:number; //Largest samples length
	currentLen:number; //Length of current blocks added
	svgWidth=800;
	blockHeight=20;
	svgHeight=100;
	tempGene:Gene;
	constructor(private sanitizer:DomSanitizer){
		this.maxLen=4000;
		this.currentLen=0;
		this.tempGene={
			name:"",
			color:"",
			length:0,
			direction:''
		}
		this.genes=[];
/*		var gene1:Gene={ //Test Case
			name:'testGene',
			length:1500,
			color:"red",
			direction:'forward'
		};
		var gene2:Gene={
			name:'testGene2',
			length:2000,
			color:"#123456",
			direction:'forward'
		};		
		this.genes=[gene1,gene2]; */
		this.svgItems=[];
		for(var gene of this.genes)
		{
			this.blockCreate(gene);
		};


	}
	addGene()
	{
		if(this.tempGene.name && this.tempGene.color && this.tempGene.length && this.tempGene.direction)
		{
			this.genes.push(this.tempGene);
			this.tempGene={
				name:"",
				color:"",
				length:0,
				direction:''
			}
			this.refresh();
		}
		else{
			alert('incorrect format')
		}
	}
	refresh()
	{
		this.currentLen=0;
		this.svgItems=[];
		for(var gene of this.genes)
		{
			this.blockCreate(gene);
		};
	}
	blockCreate(gene:Gene)
	{
		if (gene.direction=='forward'){
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var blockLen= .9*len;
			var arrowLen= .1*len;
			var x1 =  this.currentLen;
			var bWidth = blockLen;
			var y1 = 50-this.blockHeight/2;
			var bH=this.blockHeight;

			var aY1=50+this.blockHeight/2;
			var aX1=x1+bWidth;
			var aX2=aX1+arrowLen;
			var aY2=50-this.blockHeight/2;
			var labelX=x1+bWidth/2;
			var labelY=aY1+bH;
			var rotate="rotate(60 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;


		}
		else{
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var arrowLen= .1*len;
			var x1 =  this.currentLen + arrowLen;
			var bWidth = .9*len;
			var y1 = 50-this.blockHeight/2;
			var bH=this.blockHeight;

			var aY1=50+this.blockHeight/2;
			var aX1=this.currentLen+arrowLen;
			var aX2=this.currentLen;
			var aY2=50-this.blockHeight/2;
			var labelX=x1+bWidth/2;
			var labelY=aY1+bH;
			var rotate="rotate(60 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;


		}
		var block:Block={
			name:gene.name,
			x1:x1,
			bWidth:bWidth,
			y1:y1,
			bH:bH,
			color:this.sanitizer.bypassSecurityTrustStyle('fill:'+gene.color+';'),
			arrow:arrow,
			labelX:labelX,
			labelY:labelY,
			rotate:rotate			
		}
		this.currentLen=this.currentLen+len;
		this.svgItems.push(block)

	}
	deleteBlock(i:number){
		this.genes.splice(i,1);
		this.refresh();
	}
}


export interface Gene{
	name:string;
	length:number;
	color:string;
	direction:string;

}

export interface Block{
	name:string;
	x1:number;
	bWidth:number;
	y1:number;
	bH:number;
	color:any;
	arrow:string;
	labelX:number;
	labelY:number;
	rotate:string;
}

