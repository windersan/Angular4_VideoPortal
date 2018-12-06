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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
// Observable class extensions
require("rxjs/add/observable/of");
// Observable operators
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
var LoginComponent = (function () {
    //inject HttpClient
    function LoginComponent(http) {
        this.http = http;
        this.title = 'CROSSOVER';
        this.sessionId = '';
        this.status = '';
        //flag for the structural directive that hides the UI from non-authorized users
        this.loggedIn = 'f';
        //index for the next video to be loaded
        this.videoIndex = 0;
        //objects for the HTTP [POST] operations
        this.user = { username: "", password: "" };
        this.videoRating = { videoId: "", rating: "" };
    }
    //loads the main video 
    LoginComponent.prototype.load = function (video) {
        this.selectedVideo = video;
        this.videoRating.videoId = this.selectedVideo._id;
        window.scrollTo(0, 0);
    };
    //[POST]
    LoginComponent.prototype.submit = function () {
        var _this = this;
        var body = this.user;
        try {
            this.http.post('http://localhost:27017/user/auth', body).subscribe(function (data) {
                console.log(data);
                _this.sessionId = data['sessionId'];
                _this.status = data['status'];
                if (_this.status == 'success') {
                    _this.loggedIn = 't';
                    _this.getvideos();
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    //[GET]
    LoginComponent.prototype.logout = function () {
        var _this = this;
        var str = 'http://localhost:27017/user/logout?sessionId=' + this.sessionId;
        try {
            this.http.get(str).subscribe(function (data) {
                _this.status = data['status'];
                if (_this.status == 'success') {
                    _this.loggedIn = 'f';
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    //[GET]
    LoginComponent.prototype.getvideos = function () {
        var _this = this;
        if (this.videoIndex < 50) {
            var str = 'http://localhost:27017/videos?sessionId=' + this.sessionId + '&skip=' + this.videoIndex + '&limit=10';
            try {
                this.http.get(str).subscribe(function (data) {
                    console.log(data);
                    _this.videosTemp = data['data'];
                    if (_this.videoIndex == 0) {
                        _this.videos = _this.videosTemp;
                    }
                    for (var i = (_this.videoIndex); i < (10 + _this.videoIndex); i++) {
                        if (_this.videoIndex != 0) {
                            _this.videos[i] = _this.videosTemp[(i - _this.videoIndex)];
                        }
                        _this.videos[i].url = 'http://localhost:27017/' + _this.videos[i].url;
                        console.log(_this.videos[i].ratings);
                        _this.videos[i].avgRating = 0;
                        for (var j = 0; j < _this.videos[i].ratings.length; j++) {
                            _this.videos[i].avgRating += _this.videos[i].ratings[j];
                        }
                        _this.videos[i].avgRating /= _this.videos[i].ratings.length;
                        _this.videos[i].avgRating = parseFloat(_this.videos[i].avgRating.toFixed(2));
                        _this.videos[i].sessionRating = '';
                    }
                    _this.videoIndex += 10;
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    //[POST]
    LoginComponent.prototype.submitRating = function () {
        var _this = this;
        try {
            this.selectedVideo.sessionRating = this.videoRating.rating;
            var body = this.videoRating;
            var url = 'http://localhost:27017/video/ratings?sessionId=' + this.sessionId;
            this.http.post(url, body).subscribe(function (data) {
                console.log(data);
                _this.status = data['status'];
                _this.status = _this.status + 'for rating post';
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    LoginComponent.prototype.ngOnInit = function () { };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login',
        styleUrls: ['app/login.component.css'],
        template: "\n    <div   *ngIf=\"loggedIn=='f'\">\n        <h1>{{title}}</h1>\n        <input type=\"text\"  id=\"username\" required [(ngModel)]=\"user.username\">\n        <input type=\"password\"  id=\"password\" required [(ngModel)]=\"user.password\">\n        <button (click)=\"submit()\">Login</button>\n    </div>\n    <div *ngIf=\"loggedIn=='t'\">\n        <header>\n            <button (click)=\"logout()\">LOG OUT</button>    \n        </header>     \n        <main>\n        <h1 id=\"message\" *ngIf=\"selectedVideo==null\">SELECT A VIDEO</h1>\n        <h1>{{selectedVideo.name}}</h1>\n            <video id=\"player\" *ngIf=\"selectedVideo!=null\" width=\"90%\" controls [src] = \"selectedVideo.url\" controls>     \n            </video>\n            <p *ngIf=\"selectedVideo!=null\">Rating: {{selectedVideo.avgRating}}</p>\n            <p *ngIf=\"selectedVideo!=null\">{{selectedVideo.description}}</p><br/><br/>\n            <p *ngIf=\"selectedVideo!=null\">Your rating for this video: </p> \n            <div *ngIf=\"selectedVideo!=null&&selectedVideo.sessionRating==''\">\n                <input type=\"text\"  id=\"rating\" required [(ngModel)]=\"videoRating.rating\">\n                <button (click)=\"submitRating()\">RATE</button>(1-5)\n            </div>\n            <p>{{selectedVideo.sessionRating}}</p>\n        </main>    \n        <nav>\n            <li *ngFor=\"let video of videos\" id=\"videoList\">\n                <div (click)=\"load(video)\" class='liEl'>\n                    <p>{{video.name}}</p>\n                    <video width=\"95%\" controls>\n                        <source src={{video.url}} type=\"video/mp4\">\n                    </video>\n                    <p>Rating: {{video.avgRating}}            \n                </div>\n            </li>\n            <button (click)=\"getvideos()\">LOAD MORE VIDEOS</button>\n        </nav>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [http_1.HttpClient])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map