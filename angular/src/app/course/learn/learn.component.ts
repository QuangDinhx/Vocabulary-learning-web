import { Component, OnInit } from '@angular/core';

import { ListService, PagedResultDto } from '@abp/ng.core';
import { Router,ActivatedRoute } from '@angular/router';
import { LearnService } from '@proxy/learns';
import { LessionService } from '@proxy/lessions';
import { Word, WordDto, WordService } from '@proxy/words';
import { Words } from '@proxy';


@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {
  idlesson : any;
  test : Array<testx> = new Array();
  words: Array<Word> = new Array();
  currnumber : number  ;
  conlai : number ;
  currentes: testx;
  showans : false;
  state:string;
  
  constructor(//public readonly list: ListService, 
   private learnService: LearnService, 
  private wordService: WordService, 
   private route: ActivatedRoute,
   private lessonService: LessionService,
   private router: Router,
    
    
  ) { }

  ngOnInit(): void {
    this.state = "unknow";
    this.idlesson =  this.route.snapshot.params.idLession;
    this.wordService.getWordOfLessionById(this.idlesson).
    subscribe((data => {
     
      this.words = data;
     this.conlai = this.words.length;
     this.generateQuestion();
     this.currentes = this.test[0];
    // this.dapan1 =this.currentes.arr[0].word.en;
     //console.log('dap an 1',this.currentes.arr[0].word.en);
    //console.log('test o trong',this.test);
    }));
    
    
    //console.log('wrod2',this);
   // console.log('test o ngoaif',this.test);
  }
  
  generateQuestion()
  {
    var len = this.words.length;
    
   
   
    
    this.words.forEach((value , index) => {
      
      
     let tmp = this.words.slice();
     tmp[index] = tmp[tmp.length -1];
      let tmpindex : number = 0;
      
    
      tmpindex = this.randomIntFromInterval(0,tmp.length-2);
      let w1 = tmp[tmpindex];
      tmp[tmpindex] = tmp[tmp.length - 2];
      
      
      tmpindex = this.randomIntFromInterval(0,tmp.length-3);
      let w2 = tmp[tmpindex];
      tmp[tmpindex] = tmp[tmp.length - 3];
      
      tmpindex = this.randomIntFromInterval(0,tmp.length-4);
      let w3 = tmp[tmpindex];
      tmp[tmpindex] = tmp[tmp.length - 4];
      
      tmpindex = this.randomIntFromInterval(0,tmp.length-5);
      let w4 = tmp[tmpindex];
      tmp[tmpindex] = tmp[tmp.length - 5];
      
      var object = {
        arr: [{
          word: w1, ans: false

        },{
          word: w2, ans: false
        },{
          word: w3, ans: false
        },{
          word: w4, ans: false
        }],
        ans: value
      };
      var x = this.randomIntFromInterval(0,3);
      object.arr[x].ans = true;
      object.arr[x].word = value;
      //console.log('ob',object);
      this.test.push(object);
     
    });

    //this.currentes = this.test[0];
    //console.log('curren ', this.currentes);
    //console.log('test',this.test);
    //console.log('ob23', this.test[0]);
   // console.log('ob',this.test);
   // console.log('ob2', this.test[0]);
  }
  randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  bambne(a : number)
  {
    
    console.log(this.state)
    if(this.currentes.arr[a].ans)
    {
      alert('dung roi ');
      this.state = "true";
      this.learnService.updateLevelLearningWordByIdwordAndB(this.currentes.ans.id,true).subscribe( data => {
       // console.log(data);
      });
      
    }
    else{
      alert('sai roi ');
      this.state = "false";
      this.learnService.updateLevelLearningWordByIdwordAndB(this.currentes.ans.id,false).subscribe( data => {
      });
    }
    setTimeout(()=>{
      this.conlai -=1;
      this.currentes = this.test[this.test.length -this.conlai ];
      this.state = "unknow";
      if(this.conlai == 0){
        this.state = "done";
        let s  = this.router.url.substring(0, this.router.url.length - 5);
        setTimeout(()=>{
          this.router.navigate([s]);
        },2000)
      }
    },1000)
    
    
    }
  
}
class testx {

  arr: {
    word: Word,
    ans: boolean
  }[] ;
  ans: Word;
}
