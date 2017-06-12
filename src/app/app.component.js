"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var AppComponent = (function () {
    function AppComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.svgWidth = 800; // Total width in pixels of the SVG container
        this.blockHeight = 20; // Height of genes
        this.svgHeight = 100; // Height of full SVG box
        // Initialize Variables		
        this.maxLen = 20000;
        this.arrowP = 1;
        this.currentLen = 0;
        this.widthErr = 0;
        this.errShow = false;
        this.tempGene = {
            name: "",
            color: "",
            length: 0,
            direction: '',
            arrow: false
        };
        this.genes = [];
        this.svgItems = [];
        // If any initial genes map them
        for (var _i = 0, _a = this.genes; _i < _a.length; _i++) {
            var gene = _a[_i];
            this.blockCreate(gene);
        }
        ;
        // Initial SVGcrowbar to enable downloading of SVG
        this.svgCrowBar = document.createElement("script");
        this.svgCrowBar.type = "text/javascript";
        this.svgCrowBar.src = "svgCrowbar.js";
        this.svgCrowBar.id = "crowbar";
        // Verify that files can be read by current browser
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log('file reader on');
        }
        else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }
    // On button click in html, appends user inputted gene stored in tempGene through ngModel	 
    AppComponent.prototype.addGene = function () {
        if (this.tempGene.length && this.tempGene.direction) {
            this.genes.push(this.tempGene);
            this.tempGene = {
                name: "",
                color: "",
                length: 0,
                direction: '',
                arrow: false,
            };
            this.refresh();
        }
        else {
            alert('Length and Direction Required');
        }
    };
    // Writes error message and displays it 
    AppComponent.prototype.errMess = function (message) {
        this.error = message;
        this.errShow = true;
    };
    // Cleares SVG image, recreates based on updates to parameters
    AppComponent.prototype.refresh = function () {
        // Reset initial conditions
        this.currentLen = 0;
        this.svgItems = [];
        this.widthErr = 0;
        this.errShow = false;
        // Generate new SVG
        for (var _i = 0, _a = this.genes; _i < _a.length; _i++) {
            var gene = _a[_i];
            this.blockCreate(gene);
        }
        ;
        // Log errors
        if (this.widthErr) {
            this.errMess("At this arrow length figure may be disproportionate, reduce arrow length to fix");
        }
        this.edit = -1;
    };
    // Creates and formats genes in to SVG image parts
    AppComponent.prototype.blockCreate = function (gene) {
        if (!gene.arrow) {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var arrowLen = this.arrowP * this.svgWidth / 100; // arrow length as percent of SVG width
            var bWidth = len - arrowLen;
            // Gives warning if arrow length too long for gene
            if (bWidth < 0) {
                this.widthErr = 1;
                bWidth = 0;
            }
        }
        else {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var bWidth = 0;
            var arrowLen = len;
        }
        // Forward direction gene
        if (gene.direction == 'forward') {
            var x1 = this.currentLen;
            var y1 = 50 - this.blockHeight / 2;
            var bH = this.blockHeight;
            var aY1 = 50 + this.blockHeight / 2;
            var aX1 = x1 + bWidth;
            var aX2 = aX1 + arrowLen;
            var aY2 = 50 - this.blockHeight / 2;
            var labelX = x1 + bWidth / 2;
            var labelY = aY1 + bH / 2;
            var rotate = "rotate(85 " + labelX + " " + labelY + ")";
            var arrow = aX1 + ',' + aY1 + ' ' + aX1 + ',' + aY2 + ' ' + aX2 + ',' + 50;
        }
        // backwards gene flips arrow direction + position
        if (gene.direction == 'backward') {
            var x1 = this.currentLen + arrowLen;
            var y1 = 50 - this.blockHeight / 2;
            var bH = this.blockHeight;
            var aY1 = 50 + this.blockHeight / 2;
            var aX1 = this.currentLen + arrowLen;
            var aX2 = this.currentLen;
            var aY2 = 50 - this.blockHeight / 2;
            var labelX = x1 + bWidth / 2;
            var labelY = aY1 + bH / 2;
            var rotate = "rotate(85 " + labelX + " " + labelY + ")";
            var arrow = aX1 + ',' + aY1 + ' ' + aX1 + ',' + aY2 + ' ' + aX2 + ',' + 50;
        }
        // creates blank space to represent non-coding regions
        if (gene.direction == 'nonCoding') {
            this.widthErr = 0;
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var arrowLen = 0;
            var x1 = this.currentLen + arrowLen;
            var bWidth = len;
            var y1 = 50 - this.blockHeight / 2;
            var bH = this.blockHeight;
            var aY1 = 50 + this.blockHeight / 2;
            var aX1 = this.currentLen + arrowLen;
            var aX2 = this.currentLen;
            var aY2 = 50 - this.blockHeight / 2;
            var labelX = x1 + bWidth / 2;
            var labelY = aY1 + bH;
            var rotate = "rotate(85 " + labelX + " " + labelY + ")";
            var arrow = aX1 + ',' + aY1 + ' ' + aX1 + ',' + aY2 + ' ' + aX2 + ',' + 50;
            gene.color = 'transparent';
        }
        // If uploaded file, selects only for certain positions if range inputted
        if (this.files) {
            if ((gene.pos[0] >= this.start) && (gene.pos[1] <= this.end || !this.end)) {
                var block = {
                    name: gene.name,
                    x1: x1,
                    bWidth: bWidth,
                    y1: y1,
                    bH: bH,
                    color: this.sanitizer.bypassSecurityTrustStyle('fill:' + gene.color + ';'),
                    arrow: arrow,
                    labelX: labelX,
                    labelY: labelY,
                    rotate: rotate
                };
                this.currentLen = this.currentLen + len;
                this.svgItems.push(block);
            }
        }
        else {
            var block = {
                name: gene.name,
                x1: x1,
                bWidth: bWidth,
                y1: y1,
                bH: bH,
                color: this.sanitizer.bypassSecurityTrustStyle('fill:' + gene.color + ';'),
                arrow: arrow,
                labelX: labelX,
                labelY: labelY,
                rotate: rotate
            };
            this.currentLen = this.currentLen + len;
            this.svgItems.push(block);
        }
    };
    // Removes gene from sequence when deleted, calls refresh to update SVG
    AppComponent.prototype.deleteBlock = function (i) {
        this.genes.splice(i, 1);
        this.refresh();
    };
    // Enable specific gene editing
    AppComponent.prototype.editBlock = function (i) {
        this.edit = i;
    };
    // uses SVG Crowbar to download image on click of download button
    AppComponent.prototype.SVGdownload = function () {
        document.getElementsByTagName("head")[0].appendChild(this.svgCrowBar);
    };
    // Auto fills genes when genbank file uploaded
    AppComponent.prototype.onChange = function (event) {
        var _this = this;
        // get file & create reader
        if (event) {
            this.files = event.srcElement.files;
            var init = 1;
        }
        var reader = new FileReader();
        // Parses file and generates genes on readAsText call
        reader.onload = function (e) {
            var lines = reader.result.split("gene");
            var genes = [];
            var lastGene = [];
            for (var line in lines) {
                var match = lines[line].match(/[0-9]+\.\.+[0-9]*/g); // regex to get position of genes
                var matchC = lines[line].match(/\([0-9]+\.\.+[0-9]*/g);
                var notFull = lines[line].match("ORGANISM"); // line with ORGANISM would create one gene for entire genome, not desired
                if (match && !notFull) {
                    // more than 2 matches indicates duplicates
                    if (match.length <= 2) {
                        var pos = match[0].split("..");
                        pos[0] = Number(pos[0]); //start base
                        pos[1] = Number(pos[1]); // end base
                        var len = pos[1] - pos[0];
                        var name = lines[line].match(/\/product="+.{1,}/g);
                        if (init) {
                            _this.start = pos[0];
                            init = 0;
                        }
                        // if associated function, funciton used as name, otherwise locus_tag is used. If neither given name "no name"
                        if (name) {
                            name = name[0].slice(10, -1);
                            var tag = lines[line].match(/\/locus_tag="+.{1,}/g);
                            tag = tag[0].slice(12, -1);
                            name = tag.concat(': ').concat(name);
                        }
                        else {
                            name = lines[line].match(/\/locus_tag="+.{1,}/g);
                            if (name) {
                                name = name[0].slice(12, -1);
                            }
                            else {
                                name = 'No Name';
                            }
                        }
                        var direction = "backward";
                        if (matchC) {
                            direction = "forward";
                        }
                        var space = 0;
                        // Finds space between previous coding segment to generate non-coding block
                        if (lastGene) {
                            space = pos[0] - lastGene[3];
                        }
                        // if overlap is less than 10 base pairs sets it to zero. Otherwise does not add gene
                        if (space < 0) {
                            if (space > -10) {
                                space = 0;
                                var gene = [name, len, pos[0], pos[1], space];
                                genes.push(gene);
                                lastGene = gene;
                            }
                            else {
                            }
                        }
                        else {
                            var gene = [name, len, pos[0], pos[1], space];
                            genes.push(gene);
                            lastGene = gene;
                        }
                    }
                }
            }
            var each;
            // creates gene object for each one parsed from GenBank file
            for (each in genes) {
                var tGene;
                each = genes[each];
                // adds spacer if neccesary
                if (each[4]) {
                    tGene = {
                        name: ' ',
                        length: each[4],
                        color: 'black',
                        direction: 'nonCoding',
                        arrow: false,
                        pos: [each[2], each[3]]
                    };
                    _this.genes.push(tGene);
                }
                tGene = {
                    name: each[0],
                    length: each[1],
                    color: 'black',
                    direction: direction,
                    arrow: false,
                    pos: [each[2], each[3]]
                };
                _this.genes.push(tGene);
            }
            _this.refresh();
        };
        reader.readAsText(this.files[0]);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: 'app/app.html',
    }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map