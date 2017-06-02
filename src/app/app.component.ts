import { Component} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.html',
})
export class AppComponent  { 

	genes:Gene[];		// Genes to be mapped
	svgItems:Block[];	// Individual drawn elements in SVG format taken from genes variable
	maxLen:number; 		// Largest samples length
	currentLen:number; 	// Length of current blocks added
	svgWidth=800; 		// Total width in pixels of the SVG container
	blockHeight=20; 	// Height of genes
	svgHeight=100; 		// Height of full SVG box
	tempGene:Gene; 		// Stores gene to be added
	svgCrowBar:any; 	// Script to help download svg 
	edit:number; 		// Indicates which gene is selected to be edited
	files:any; 			// Uploaded genbank file 
	arrowP:number; 		// Percent of SVG width arrows should be
	widthErr:number; 	// If arrow length is longer than a gene set to true
	errShow:boolean;	// If error, show error message box
	error:any;			// Stores error message
	start:number;
	end:number;

	constructor(private sanitizer:DomSanitizer){
		// Initialize Variables		
		this.maxLen=20000;
		this.arrowP=1;
		this.currentLen=0;
		this.widthErr=0;
		this.errShow=false;
		this.tempGene={
			name:"",
			color:"",
			length:0,
			direction:'',
			arrow:false
		}
		this.genes=[];
		this.svgItems=[];

		// If any initial genes map them
		for(var gene of this.genes)
		{
			this.blockCreate(gene);
		};

		// Initial SVGcrowbar to enable downloading of SVG
		this.svgCrowBar=document.createElement("script");
		this.svgCrowBar.type="text/javascript";
		this.svgCrowBar.src="svgCrowbar.js";
		this.svgCrowBar.id="crowbar";

		// Verify that files can be read by current browser
		if ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob) {
  			console.log('file reader on');
		} else {
		  alert('The File APIs are not fully supported in this browser.');
		}
	}

		
	// On button click in html, appends user inputted gene stored in tempGene through ngModel	 
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

	// Writes error message and displays it 
	errMess(message:any)
	{
		this.error=message;
		this.errShow=true;

	}

	// Cleares SVG image, recreates based on updates to parameters
	refresh()
	{
		// Reset initial conditions
		this.currentLen=0;
		this.svgItems=[];
		this.widthErr=0;
		this.errShow=false;
		// Generate new SVG
		for(var gene of this.genes)
		{
			this.blockCreate(gene);
		};

		// Log errors
		if(this.widthErr)
		{
			this.errMess("At this arrow length figure may be disproportionate, reduce arrow length to fix");
		}
		this.edit=-1;
	}

	// Creates and formats genes in to SVG image parts
	blockCreate(gene:Gene)
	{
		if(!gene.arrow) // Checks if arrow only box checked. If not, creates a full block + arrow image
		{
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var arrowLen= this.arrowP*this.svgWidth/100;	 // arrow length as percent of SVG width
			var bWidth = len-arrowLen;

			// Gives warning if arrow length too long for gene
			if(bWidth<0)
			{
				this.widthErr=1;
				bWidth=0;
				
			}
		}
		// Creates arrow only
		else{
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var bWidth = 0;
			var arrowLen= len;
		}
		// Forward direction gene
		if (gene.direction=='forward'){


			var x1 =  this.currentLen;			
			var y1 = 50-this.blockHeight/2;
			var bH=this.blockHeight;

			var aY1=50+this.blockHeight/2;
			var aX1=x1+bWidth;
			var aX2=aX1+arrowLen;
			var aY2=50-this.blockHeight/2;
			var labelX=x1+bWidth/2;
			var labelY=aY1+bH/2;
			var rotate="rotate(85 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;


		}

		// backwards gene flips arrow direction + position
		if(gene.direction=='backward'){
			var x1 =  this.currentLen + arrowLen;
			var y1 = 50-this.blockHeight/2;
			var bH=this.blockHeight;

			var aY1=50+this.blockHeight/2;
			var aX1=this.currentLen+arrowLen;
			var aX2=this.currentLen;
			var aY2=50-this.blockHeight/2;
			var labelX=x1+bWidth/2;
			var labelY=aY1+bH/2;
			var rotate="rotate(85 "+labelX+" "+labelY+")";

			var arrow=aX1+','+aY1+' '+aX1+','+aY2+' '+aX2+','+50 ;
		}

		// creates blank space to represent non-coding regions
		if(gene.direction=='nonCoding'){
			this.widthErr=0;
			var len = (this.svgWidth*gene.length)/this.maxLen;
			var arrowLen=0;
			var x1 =  this.currentLen + arrowLen;
			var bWidth = len;
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
		if(this.files)
		{
			if((gene.pos[0]>=this.start)&&(gene.pos[1]<=this.end || !this.end))
			{
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
		}
		else
		{
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


	}

	// Removes gene from sequence when deleted, calls refresh to update SVG
	deleteBlock(i:number){
		this.genes.splice(i,1);
		this.refresh();
	}

	// Enable specific gene editing
	editBlock(i:number)
	{
		this.edit=i;
	}

	// uses SVG Crowbar to download image on click of download button
	SVGdownload(){
		document.getElementsByTagName("head")[0].appendChild(this.svgCrowBar);
	}

	// Auto fills genes when genbank file uploaded
	onChange(event:any){

		// get file & create reader
		if(event)
		{
		this.files = event.srcElement.files;
		var init=1;
		}
	    
	    let reader=new FileReader();

	    // Parses file and generates genes on readAsText call
		reader.onload = (e) => {
		    var lines = reader.result.split("gene");
		    var genes=[];
		    var lastGene=[]; 
		    
		    for( var line in lines) // go through each line of file
		    {

		    	var match = lines[line].match(/[0-9]+\.\.+[0-9]*/g) // regex to get position of genes
		    	var notFull = lines[line].match("ORGANISM"); // line with ORGANISM would create one gene for entire genome, not desired
		    	if(match && !notFull)
		    	{
		    		// more than 2 matches indicates duplicates
			    	if(match.length <= 2)
			    	{
			    		var pos=match[0].split("..");
			    		pos[0]=Number(pos[0]); //start base
			    		pos[1]=Number(pos[1]); // end base
			    		var len=pos[1]-pos[0];
			    		var name = lines[line].match(/\/product="+.{1,}/g);
			    		if(init)
			    		{
			    			this.start=pos[0];
			    			init=0;
			    		}
	  	
			    		// if associated function, funciton used as name, otherwise locus_tag is used. If neither given name "no name"
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
			    		
			    		// Finds space between previous coding segment to generate non-coding block
			    		if(lastGene)
			    		{
							space=pos[0]- lastGene[3];
			    		}

			    		// if overlap is less than 10 base pairs sets it to zero. Otherwise does not add gene
			    		if(space<0)
			    		{
			    			if(space>-10)
			    			{
			    				space=0;
					    		var gene=[name,len,pos[0],pos[1],space];
					    		genes.push(gene);
					    		lastGene=gene;			    				
			    			}
			    			else{

			    			}
			    			
			    		}
			    		// if no overlap, adds gene with spacer
			    		else{
				    		var gene=[name,len,pos[0],pos[1],space]
				    		genes.push(gene);
				    		lastGene=gene;
			    		}
			    		

			    	}
		    	}
		    }
		    var each:any;

		    // creates gene object for each one parsed from GenBank file
		    for(each in genes)
		    {
		    	var tGene:Gene;
		    	each=genes[each];

		    	// adds spacer if neccesary
		    	if(each[4])
		    	{
			    	tGene={
			    		name:' ',
			    		length:each[4],
			    		color:'black',
			    		direction:'nonCoding',
			    		arrow:false,
			    		pos:[each[2],each[3]]
			    	}
			    	this.genes.push(tGene);		    		
		    	}		    	
		    	
		    	tGene={
		    		name:each[0],
		    		length:each[1],
		    		color:'black',
		    		direction:'forward',
		    		arrow:false,
		    		pos:[each[2],each[3]]
		    	}
		    	this.genes.push(tGene);

		    }
		    this.refresh();
		}

		reader.readAsText(this.files[0]);

	}
}


export interface Gene{
	name:string;
	length:number;
	color:string;
	direction:string;
	arrow:boolean;
	pos?:any;

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

