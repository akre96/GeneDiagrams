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
            direction: ''
        };
        this.genes = [];
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
        this.svgItems = [];
        for (var _i = 0, _a = this.genes; _i < _a.length; _i++) {
            var gene = _a[_i];
            this.blockCreate(gene);
        }
        ;
    }
    AppComponent.prototype.addGene = function () {
        if (this.tempGene.name && this.tempGene.color && this.tempGene.length && this.tempGene.direction) {
            this.genes.push(this.tempGene);
            this.tempGene = {
                name: "",
                color: "",
                length: 0,
                direction: ''
            };
            this.refresh();
        }
        else {
            alert('incorrect format');
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
        if (gene.direction == 'forward') {
            var len = (this.svgWidth * gene.length) / this.maxLen;
            var blockLen = .9 * len;
            var arrowLen = .1 * len;
            var x1 = this.currentLen;
            var bWidth = blockLen;
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
        else {
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