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
	svgCrowBar:any;
	edit:number;
	files:any;
	constructor(private sanitizer:DomSanitizer){
		this.maxLen=4000;
		this.currentLen=0;
		this.tempGene={
			name:"",
			color:"",
			length:0,
			direction:'',
			arrow:false
		}
		this.genes=[];
		this.svgItems=[];
		for(var gene of this.genes)
		{
			this.blockCreate(gene);
		};
		this.svgCrowBar=document.createElement("script");
		this.svgCrowBar.type="text/javascript";
		this.svgCrowBar.src="svgCrowbar.js";
		this.svgCrowBar.id="crowbar";
		if ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob) {
  			console.log('file reader on');
		} else {
		  alert('The File APIs are not fully supported in this browser.');
		}


	}
	addGene()
	{
		if(this.tempGene.length && this.tempGene.direction)
		{
			this.genes.push(this.tempGene);
			this.tempGene={
				name:"",
				color:"",
				length:0,
				direction:'',
				arrow:false,
			}
			this.refresh();
		}
		else{
			alert('Length and Direction Required')
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
		this.edit=-1;
	}
	blockCreate(gene:Gene)
	{
		if(!gene.arrow)
		{
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var bWidth = .9*len;
			var arrowLen= .1*len;	
		}
		else{
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var bWidth = 0;
			var arrowLen= len;
		}
		if (gene.direction=='forward'){


			var x1 =  this.currentLen;			
			var y1 = 50-this.blockHeight/2;
			var bH=this.blockHeight;

			var aY1=50+this.blockHeight/2;
			var aX1=x1+bWidth;
			var aX2=aX1+arrowLen;
			var aY2=50-this.blockHeight/2;
			var labelX=x1+bWidth/2;
			var labelY=aY1+bH;
			var rotate="rotate(85 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;


		}
		if(gene.direction=='backward'){
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
			var rotate="rotate(85 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;
		}
		if(gene.direction=='nonCoding'){
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
			var rotate="rotate(85 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;
			gene.color='transparent'
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
	editBlock(i:number)
	{
		this.edit=i;
	}
	SVGdownload(){
		document.getElementsByTagName("head")[0].appendChild(this.svgCrowBar);



	}
	onChange(event:any){
	    var files = event.srcElement.files;
	    let reader=new FileReader();
		reader.onload = (e) => {
		    this.files=reader.result;
		    var lines = this.files.split("gene");
		    var genes=[];
		    var lastGene=[];
		    for( var line in lines)
		    {
		    	
		    	var match = lines[line].match(/[0-9]+\.\.+[0-9]*/g)
		    	var notFull = lines[line].match("ORGANISM");
		    	if(match && !notFull)
		    	{
			    	if(match.length <= 2)
			    	{
			    		var pos=match[0].split("..");
			    		pos[0]=Number(pos[0]);
			    		pos[1]=Number(pos[1]);
			    		var len=pos[1]-pos[0];
			    		var name = lines[line].match(/\/product="+.{1,}/g);
			    		if(name)
			    		{
			    			name = name[0].slice(10,-1);
			    		}
			    		else
			    		{
			    			name = lines[line].match(/\/locus_tag="+.{1,}/g);
			    			if(name)
			    			{
			    				name = name[0].slice(12,-1);
			    			}
			    			else{
			    				name='No Name'
			    			}
			    			
			    		}
			    		var space = 0;
			    		
			    		console.log(lastGene);
			    		if(lastGene)
			    		{
							space=pos[0]- lastGene[3];
			    		}
			    		if(space<0)
			    		{
			    			if(space>-10)
			    			{
			    				space=0
					    		var gene=[name,len,pos[0],pos[1],space]
					    		genes.push(gene);
					    		lastGene=gene;			    				
			    			}
			    			else{

			    			}
			    			
			    		}
			    		else{
				    		var gene=[name,len,pos[0],pos[1],space]
				    		genes.push(gene);
				    		lastGene=gene;
			    		}

			    	}
		    	}
		    }
		    var each:any;
		    for(each in genes)
		    {
		    	var tGene:Gene;
		    	each=genes[each];
		    	if(each[4])
		    	{
			    	tGene={
			    		name:' ',
			    		length:each[4],
			    		color:'black',
			    		direction:'nonCoding',
			    		arrow:false
			    	}
			    	this.genes.push(tGene);		    		
		    	}		    	
		    	
		    	tGene={
		    		name:each[0],
		    		length:each[1],
		    		color:'black',
		    		direction:'forward',
		    		arrow:false
		    	}
		    	this.genes.push(tGene);

		    }
		    this.refresh();
		}

		reader.readAsText(files[0]);

	}
}


export interface Gene{
	name:string;
	length:number;
	color:string;
	direction:string;
	arrow:boolean;

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

