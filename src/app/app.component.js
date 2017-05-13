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
        this.svgWidth = 800;
        this.blockHeight = 20;
        this.svgHeight = 100;
        this.maxLen = 4000;
        this.currentLen = 0;
        this.tempGene = {
            name: "",
            color: "",
            length: 0,
            direction: '',
            arrow: false
        };
        this.genes = [];
        this.svgItems = [];
        for (var _i = 0, _a = this.genes; _i < _a.length; _i++) {
            var gene = _a[_i];
            this.blockCreate(gene);
        }
        ;
        this.svgCrowBar = document.createElement("script");
        this.svgCrowBar.type = "text/javascript";
        this.svgCrowBar.src = "svgCrowbar.js";
        this.svgCrowBar.id = "crowbar";
    }
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
    AppComponent.prototype.refresh = function () {
        this.currentLen = 0;
        this.svgItems = [];
        for (var _i = 0, _a = this.genes; _i < _a.length; _i++) {
            var gene = _a[_i];
            this.blockCreate(gene);
        }
        ;
    };
    AppComponent.prototype.blockCreate = function (gene) {
        if (!gene.arrow) {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var bWidth = .9 * len;
            var arrowLen = .1 * len;
        }
        else {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var bWidth = 0;
            var arrowLen = len;
        }
        if (gene.direction == 'forward') {
            var x1 = this.currentLen;
            var y1 = 50 - this.blockHeight / 2;
            var bH = this.blockHeight;
            var aY1 = 50 + this.blockHeight / 2;
            var aX1 = x1 + bWidth;
            var aX2 = aX1 + arrowLen;
            var aY2 = 50 - this.blockHeight / 2;
            var labelX = x1 + bWidth / 2;
            var labelY = aY1 + bH;
            var rotate = "rotate(60 " + labelX + " " + labelY + ")";
            var arrow = aX1 + ',' + aY1 + ' ' + aX1 + ',' + aY2 + ' ' + aX2 + ',' + 50;
        }
        if (gene.direction == 'backward') {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var arrowLen = .1 * len;
            var x1 = this.currentLen + arrowLen;
            var bWidth = .9 * len;
            var y1 = 50 - this.blockHeight / 2;
            var bH = this.blockHeight;
            var aY1 = 50 + this.blockHeight / 2;
            var aX1 = this.currentLen + arrowLen;
            var aX2 = this.currentLen;
            var aY2 = 50 - this.blockHeight / 2;
            var labelX = x1 + bWidth / 2;
            var labelY = aY1 + bH;
            var rotate = "rotate(60 " + labelX + " " + labelY + ")";
            var arrow = aX1 + ',' + aY1 + ' ' + aX1 + ',' + aY2 + ' ' + aX2 + ',' + 50;
        }
        if (gene.direction == 'nonCoding') {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var arrowLen = .1 * len;
            var x1 = this.currentLen + arrowLen;
            var bWidth = .9 * len;
            var y1 = 50 - this.blockHeight / 2;
            var bH = this.blockHeight;
            var aY1 = 50 + this.blockHeight / 2;
            var aX1 = this.currentLen + arrowLen;
            var aX2 = this.currentLen;
            var aY2 = 50 - this.blockHeight / 2;
            var labelX = x1 + bWidth / 2;
            var labelY = aY1 + bH;
            var rotate = "rotate(60 " + labelX + " " + labelY + ")";
            var arrow = aX1 + ',' + aY1 + ' ' + aX1 + ',' + aY2 + ' ' + aX2 + ',' + 50;
            gene.color = 'transparent';
        }
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
    };
    AppComponent.prototype.deleteBlock = function (i) {
        this.genes.splice(i, 1);
        this.refresh();
    };
    AppComponent.prototype.SVGdownload = function () {
        document.getElementsByTagName("head")[0].appendChild(this.svgCrowBar);
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