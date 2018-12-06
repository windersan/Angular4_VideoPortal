import { Component , ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import {Video} from './video';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
  selector: 'login',
  styleUrls:['app/login.component.css'],
  template:`
    <div   *ngIf="loggedIn=='f'">
        <h1>{{title}}</h1>
        <input type="text"  id="username" required [(ngModel)]="user.username">
        <input type="password"  id="password" required [(ngModel)]="user.password">
        <button (click)="submit()">Login</button>
    </div>
    <div *ngIf="loggedIn=='t'">
        <header>
            <button (click)="logout()">LOG OUT</button>    
        </header>     
        <main>
        <h1 id="message" *ngIf="selectedVideo==null">SELECT A VIDEO</h1>
        <h1>{{selectedVideo.name}}</h1>
            <video id="player" *ngIf="selectedVideo!=null" width="90%" controls [src] = "selectedVideo.url" controls>     
            </video>
            <p *ngIf="selectedVideo!=null">Rating: {{selectedVideo.avgRating}}</p>
            <p *ngIf="selectedVideo!=null">{{selectedVideo.description}}</p><br/><br/>
            <p *ngIf="selectedVideo!=null">Your rating for this video: </p> 
            <div *ngIf="selectedVideo!=null&&selectedVideo.sessionRating==''">
                <input type="text"  id="rating" required [(ngModel)]="videoRating.rating">
                <button (click)="submitRating()">RATE</button>(1-5)
            </div>
            <p>{{selectedVideo.sessionRating}}</p>
        </main>    
        <nav>
            <li *ngFor="let video of videos" id="videoList">
                <div (click)="load(video)" class='liEl'>
                    <p>{{video.name}}</p>
                    <video width="95%" controls>
                        <source src={{video.url}} type="video/mp4">
                    </video>
                    <p>Rating: {{video.avgRating}}            
                </div>
            </li>
            <button (click)="getvideos()">LOAD MORE VIDEOS</button>
        </nav>
    </div>
  `
})

export class LoginComponent {

    title = 'CROSSOVER';
    sessionId = '';
    status = '';
    videos: Video[];
    
    //flag for the structural directive that hides the UI from non-authorized users
    loggedIn = 'f';

    //index for the next video to be loaded
    videoIndex= 0;

    //temporary array needed for logic in getvideos()
    videosTemp: Video[]; 

    //video that the user chooses by clicking an element from the video list
    selectedVideo: Video;

    //objects for the HTTP [POST] operations
    user={username:"", password:""};
    videoRating={videoId:"", rating:""};

    //inject HttpClient
    constructor(private http: HttpClient) {}

    //loads the main video 
    load(video: Video): void{
        this.selectedVideo = video;
        this.videoRating.videoId = this.selectedVideo._id;
        window.scrollTo(0, 0);
    }

    //[POST]
    submit(){
        const body = this.user;
        try{
        this.http.post('http://localhost:27017/user/auth', body).subscribe(data => {console.log(data);
            this.sessionId = data['sessionId'];
            this.status = data['status'];
            if(this.status=='success'){this.loggedIn='t';this.getvideos();}
        });}catch(e){console.log(e);}
    }

    //[GET]
    logout(){
        var str = 'http://localhost:27017/user/logout?sessionId='+ this.sessionId;
        try{
        this.http.get(str).subscribe(data => {     
        this.status = data['status'];
        if(this.status=='success'){this.loggedIn='f';}
        });}catch(e){console.log(e);}
    }

    //[GET]
    getvideos() {
        if(this.videoIndex<50){
            var str = 'http://localhost:27017/videos?sessionId='+ this.sessionId + '&skip=' + this.videoIndex + '&limit=10';
            try{
            this.http.get(str).subscribe(data => {console.log(data);
                this.videosTemp = data['data'];
                if(this.videoIndex==0){this.videos=this.videosTemp;}
                for (var i=(this.videoIndex); i<(10+this.videoIndex); i++) {
                    if(this.videoIndex!=0){this.videos[i]=this.videosTemp[(i-this.videoIndex)];}
                    this.videos[i].url = 'http://localhost:27017/' + this.videos[i].url;
                    console.log(this.videos[i].ratings)
                    this.videos[i].avgRating = 0;
                    for(var j=0;j<this.videos[i].ratings.length;j++){
                        this.videos[i].avgRating += this.videos[i].ratings[j];
                    }
                    this.videos[i].avgRating /= this.videos[i].ratings.length;
                    this.videos[i].avgRating = parseFloat(this.videos[i].avgRating.toFixed(2));
                    this.videos[i].sessionRating = '';
                }
                this.videoIndex += 10;    
            });}catch(e){console.log(e);}
        }  
    }

    //[POST]
    submitRating(){
        try{
        this.selectedVideo.sessionRating = this.videoRating.rating;
        const body = this.videoRating;
        var url = 'http://localhost:27017/video/ratings?sessionId=' + this.sessionId;
        this.http.post(url, body).subscribe(data => {console.log(data);
            this.status = data['status'];
            this.status = this.status + 'for rating post';
        });}catch(e){console.log(e);}
    }

    ngOnInit(): void {}
}


