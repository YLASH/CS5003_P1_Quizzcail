//HTML elemrnts
const startArea = document.getElementById("start-container")
const preArea = document.getElementById("pre-container")
const quesArea = document.getElementById("question-container")
const ques =document.getElementById("question");
const answers = document.getElementById("answer");
const correctNum = document.getElementById("correct-question");
const totalQues = document.getElementById("total-question");
const totalScores = document.getElementById("total_score");
const showResult = document.getElementById("result")
const submitBut =document.getElementById("submit");
const stopBut =document.getElementById("stop");
const againBut =document.getElementById("restart")
const wrongCount = document.getElementById("wrong")
const quiz =document.querySelector(".quiz")
const cateSelect =document.getElementById("selectCategory")
const diffSelect =document.getElementById("selectDifficulty")
const startBut =document.getElementById("start")
const inputName = document.getElementById("username")
const leaderBoard =document.getElementById("leader-board")
const timer=document.getElementById("timer")
const timerstop=document.getElementById("timerstop")
const tool1 = document.getElementById("tool1")
const tool2 = document.getElementById("tool2")
// const NextqDiff = document.getElementById("NextqDiffculty")


//variables
let correctAnswer = "" ,correct_Count = askedCount =0, totalQuestions = 10 ;
let diffculty ="";
let DataAns =[];
let correctAns =[];
let score = 0;
let incorrect_Count = 0;
//let UserRecoder = [{"name":"Username0","Score":0}];
let UserRecoder = [];
let counterInterval;


//event listeners
function eventListeners(){
    startBut.addEventListener('click',startQuiz)
    submitBut.addEventListener('click',SubmitAnswer)
    stopBut.addEventListener('click',StopQuiz)
    againBut.addEventListener('click',restartQuiz)
    cateSelect.addEventListener('change',changevalue)
    diffSelect.addEventListener('change',changevalue)
    // NextqDiff.addEventListener('change',changevalue)
    tool1.addEventListener('click',crossoutAns)
    tool2.addEventListener('click',Pause1min)
    timerstop.addEventListener('click',stoptimer)

}


document.addEventListener('DOMContentLoaded',()=>{
    quesArea.style.display ='none';
    CategorySelect(); DifficulSelect() ;
    //loadQuestion() ;
    eventListeners();
    totalQues.textContent = totalQuestions ;
    correctNum.textContent = correct_Count ;
    totalScores.textContent = score ;
});

function startQuiz(){
    addUser() ;
    loadQuestion();
    loadTimer(10);
    setCount();
    //display
    startArea.style.display = 'none'
    preArea.style.display ='none'
    quesArea.style.display = "flex"
    tool1.removeAttribute('disabled')
}


async function loadQuestion(){
    const My_API_KEY = "p5sLRbPezCMhMUNUVzs6UbbC7trp3BeQf1ZgUBlt" ;
    categorySeleectd= cateSelect.value
    diffcultySeleectd = diffSelect.value

    //** unfixed bash &hard _Error_not found  */
    //NextqdiffSeleectd =NextqDiff.value
    // if(NextqdiffSeleectd != diffcultySeleectd ){
    //     diffcultySeleectd = NextqdiffSeleectd;
    // }
    if(categorySeleectd !="any" && diffcultySeleectd!= "any"){
        APIUrl= `https://quizapi.io/api/v1/questions?apiKey=${My_API_KEY}&category=${categorySeleectd}&difficulty=${diffcultySeleectd}&limit=10`
    }else if(categorySeleectd =="any" && diffcultySeleectd!= "any"){
        APIUrl= `https://quizapi.io/api/v1/questions?apiKey=${My_API_KEY}&difficulty=${diffcultySeleectd}&limit=10`
    }else if(categorySeleectd !="any" && diffcultySeleectd == "any"){
        APIUrl=`https://quizapi.io/api/v1/questions?apiKey=${My_API_KEY}&category=${categorySeleectd}&limit=10`
    }else {
        APIUrl=`https://quizapi.io/api/v1/questions?apiKey=${My_API_KEY}&limit=10`
    }

    // const result = await fetch(`${APIUrl}`);
    // const data = await result.json();
     console.log(APIUrl)
    // displayQuestion(data[0]);
    // correctAns.splice(0, correctAns.length);
    // DataAns.splice(0, DataAns.length);
    // DataCorrectAns(data[0]);
    // showResult.innerHTML="" ;
    // submitBut.disabled = false;
    // tool1function()
    
    fetch(`${APIUrl}`)
    .then(response => response.json())
    .then(data => {
        console.log(data[0].id)
        displayQuestion(data[0]);
        correctAns.splice(0, correctAns.length);
        DataAns.splice(0, DataAns.length);
        storeDataAns(data[0]);
    }).catch(error => console.log(error));

    showResult.innerHTML="" ;
    submitBut.disabled = false;    
}


//store and clean answer option from data
function storeDataAns(data){
    let ans_indx = ["a","b","c","d","e","f"]
    for( let x in ans_indx) {
        //get all the answer options from data without "null"
        var ans_nu = "answer_" + ans_indx[x];
        if(data["answers"][ans_nu] != null){
            DataAns.push("answer_" + ans_indx[x]) ;
        }
        //get correct the answers (for comparable, did not keep "correct_") 
        var ans_nu_correct = "answer_" + ans_indx[x] + "_correct";
        if(data["correct_answers"][ans_nu_correct] == "true"){
            console.log(ans_nu_correct)
            correctAns.push("answer_" + ans_indx[x]) ;
        }
    }
}


//Display question and answer options
function displayQuestion(data) {

    const answersArr= [];
    diffculty = data["difficulty"]
    let  ans_indx = ["a","b","c","d","e","f"]
    for( let x in ans_indx){
        //ans_id = "ans"+ x ;
        var ans_nu = "answer_" + ans_indx[x];
        if(data["answers"][ans_nu] != null){
            let ans_text = HTMLDecode(data["answers"][ans_nu]);
            
            answersArr.push(
                `<li> <input type="checkbox" value=${ans_nu}>${ans_indx[x]}. <span > ${ans_text} </span></li>`
            )
        }
    }
    ques.innerHTML = `${data["question"]} <br><p id="quiz-difficulty" class="quiz-difficulty"> ${data["difficulty"]}</p>`
    // NextqDiff.innerHTML = `<select id="NextqDiffculty" text="${data["difficulty"]}" value="${diffSelect.value}">
    //                   <option value="easy" > Easy </option>
    //                   <option value="medium" > Medium </option>
    //                   <option value="hard" > Hard </option>
    //                   </select>`
    answers.innerHTML =`${answersArr.join("")}`
    selectOption();
}



//CSS_ check and uncheck _change answer 
function selectOption(){
    answers.querySelectorAll("li").forEach((item)=>{
        const select = item.querySelector('input');
       select.addEventListener('change',()=>{
           if (select.checked) {
               item.classList.add("selected");
           } else {
               item.classList.remove("selected");
           }
       });
    });
}


//submit answer and check
function SubmitAnswer(){
    //stop timer
    clearInterval(counterInterval)
    submitBut.disabled = true;

    //get Answer User chose 
    let userAnsArr=[];
    const userAnsContain = answers.querySelectorAll('input')
    userAnsContain.forEach((item)=>{
        if(item.checked){
            userAnsArr.push(item.value)
        }
    })
    console.log(userAnsArr)

    //useCheckAnsArr() chceck user'Answer and correct Answer from Data is the sma or not)
    //the same ->true (correct)
    if(CheckAnsArr(userAnsArr, correctAns) === true){
        correct_Count++;
        //check diffculty to calculate the score
        if(diffculty === "Hard"){
            score +=3 ;
        }else if(diffculty === "Medium"){
            score +=2 ;
        }else{
            score ++ ;
        }
        showResult.innerHTML =`<p> <i class="fa-solid fa-check"></i>Correct Answer!</p>` ;
        totalScores.textContent = score;
    }else{
        //incorrect
        incorrect_Count++;
        showResult.innerHTML =`<p> <i class="fa-solid fa-xmark"></i>Incorrect Answer!</p>` ;
        wrongCount.innerHTML +=`&#x274C; `
        console.log(`USER ${userAnsArr} DATA ${correctAns}`)
    }

    checkcount();
}




//check Questions count
function checkcount() {
    askedCount++;
    setCount();
    //finish
    if(askedCount == totalQuestions){
        StopQuiz();
        showResult.innerHTML = `<p> Well done!  Your Score is : ${score}.</p>`;
        updateScore(username,score)
    }else if(incorrect_Count ==3){
        //lose game
        StopQuiz();
        score=0;
        totalScores.textContent = "--";
        showResult.innerHTML = `<p>QQ, Game over!  Your Score is : ${score}.</p>`;
    } else{
        //on going_ next question
        setTimeout(()=>{
            loadQuestion();
            loadTimer(10);
        }, 400);
    }
}



//display Questions count and score
function setCount(){
    totalQues.textContent= totalQuestions ;
    correctNum.textContent = correct_Count;
    totalScores.textContent= score < 10 ? '0' + score : score;
}


//Stop Quiz display
function StopQuiz(){
    clearInterval(counterInterval)
    showResult.innerHTML += `<p> Oops!  Your Score is : ${score}.</p>`;
    updateScore(username,score)
    quiz.style.visibility="hidden"
    submitBut.style.display = "none";
    stopBut.style.display = "none";
    againBut.style.display ="block";
}


//start new Game 
function restartQuiz(){
    displayLeaderboard();
    setCount();
    //reset varibles
    DataAns.splice(0, DataAns.length);
    correct_Count = askedCount = incorrect_Count = 0;
    score = totalScores.textContent = 0;
   
    //reset display
    wrongCount.innerHTML= ""
    againBut.style.display= "none";
    submitBut.style.display = "inline-flex";
    stopBut.style.display = "inline-flex";
    submitBut.disabled = false ;
    //quiz.style.display="block";
    quiz.style.visibility="visible"
    startArea.style.display = 'flex'
    preArea.style.display ='flex'
    quesArea.style.display = "none"
    tool1.removeAttribute('disabled')
    tool2.removeAttribute('disabled')
}





//select category / diffculty 
//create selecting category
function CategorySelect(){
    const category =["CMS","Code","DevOps","Docker","linux","SQL" ] 
    // remove bash and uncategorized, which only 4 and 3 questions in the dataAPI
    category.forEach((item) =>{
        cateSelect.innerHTML += `<option value="${item.toLowerCase()}">${item}</option>`
    })
}

function DifficulSelect() {
    const diff = ["easy","medium","hard"]
    diff.forEach((item) => {
        diffSelect.innerHTML += `<option value="${item.toLowerCase()}">${item}</option>`
    })
}

function changevalue(){
    categorySelectd= cateSelect.value
    console.log(categorySelectd)
    diffcultySelectd = diffSelect.value
    console.log(diffcultySelectd)
    // NextqdiffSeleectd = NextqDiff.value
    // if(NextqdiffSeleectd != diffcultySeleectd ){
    //     diffcultySeleectd = NextqdiffSeleectd;
    // }
    // console.log(NextqdiffSeleectd ,"changed")
}


//Leader Board
//
//update the score result  
//**unfixed_if(the same name){new score will cover the other old score}
function updateScore(username,score){
    UserRecoder.forEach((i)=>{
        if(i.name ===username){
           i.Score = score
        }
    })
}
//display the Leaderboard


function addUser(){
    username =inputName.value
    UserRecoder.push({"name":username,"Score":score})
    console.log(UserRecoder)
}

function displayLeaderboard(){
    //sort by the score
    UserRecoder.sort(compareByScore)
    function compareByScore(a, b) {
        if (a.Score > b.Score) {
            return -1;
        }
        if (a.Score < b.Score) {
            return 1;
        }
        return 0;
    }

    //prevent create new row repeatly old and same data   
    while(leaderBoard.hasChildNodes()){
        leaderBoard.removeChild(leaderBoard.lastChild)
    }

    leaderBoard.innerHTML = 
        `<thead>
            <tr> <th colspan="3" scope="colgroup">LEAD BOARD</th> </tr>
            <tr>
                <th>No.</th><th> Name</th> <th> Score</th>
            </tr>        
        </thead>`
    UserRecoder.forEach((item,index)=>{
        //display only top 10
        if(index<10){
            leaderBoard.innerHTML +=`<tbody id="lead_body"></tbody><tr><td> ${index+1} </td><td> ${item.name}</td><td>${item.Score}</td></tr>`
        }
    })

}



//Timer _ countdown function.

//try different ways to set the timer and did not work properly 
//this. will count down faster and faster.
    // function updatecountdown(time,interval) {
    //
    //     const minutes = Math.floor(time / 6000);
    //     let seconds = Math.floor(time / 100);
    //
    //     timer.innerHTML = `${seconds}\"<small>${mseconds}`;
    //     time--;
    //     if (time == 0) {
    //         clearInterval(interval)
    //         console.log("stop")
    //         time = startingTime;
    //     }
    // }


 function loadTimer(seconds) {
    //seconds = time woule like to count down each question for 10s ; tool_2 60s(1minute)
     var countDownTime = new Date().getTime() + seconds * 1000;
     counterInterval = setInterval(count, 10)

     function count() {
         var now = new Date().getTime();
         var gap = countDownTime - now; 
         let seconds = Math.floor(gap % (1000 * 60) / 1000);
         let mseconds = Math.floor((gap % (1000) / 10));
         seconds = seconds < 10 ? '0' + seconds : seconds;
         mseconds = mseconds < 10 ? '0' + mseconds : mseconds;
         if (gap > 0) {
            //display counting down
             timer.innerHTML = `${seconds}\'<small>${mseconds}`;
          } else {
            //when count to 0
            //stop timer 
             clearInterval(counterInterval);
             timeout();
         }
     }
 }
 //https://www.w3schools.com/howto/howto_js_countdown.asp


function timeout(){
    //time our action
     alert(`Sorry,Timeout! You lose this point \u{1F622}`)
     //return empty answer to check => get wrong
     SubmitAnswer();
 }

//stop timer _for testing
function stoptimer(){
    clearInterval(counterInterval);
    //console.log(counterInterval)
}



//Tools functions 
//Tool1_ remove wrong answers 
//** instand remove "hlaf worng", using remove wrong answers _explain more in report 
//Random choose 2 wrong options to cross it out
function crossoutAns(){
    //compare DataAns and Correct Ans to get incorrectAns
     for (let i = 0; i < DataAns.length; i++) {
         if (DataAns[i] == correctAns[0]) {
             //console.log(DataAns[i])
             DataAns.splice(i,1);
            // incorrectAns = DataAns
             console.log(DataAns)
         }
     }
     let ans_cross = []
     //only 2 option(1 wrong)
     if(DataAns.length==1){ 
        alert("Can't using on this question")
        // crossAns =answers.querySelector(`input[value=${DataAns[0]}]`)
        // crossAns.disabled = "true"
        // crossAns.parentNode.style["text-decoration"] = "line-through"
     }else{
        tool1.removeAttribute('disabled')
        for(let i =0 ;i< Math.ceil(DataAns.length /2);i++ ){
        var j=Math.ceil(Math.random()*DataAns.length /2)
            if(! ans_cross.includes(DataAns[j])){
                ans_cross.push(DataAns[j]);
            }else{
                DataAns.splice(j,1)
                var k=Math.floor(Math.random()*DataAns.length)
                ans_cross.push(DataAns[k]);
            }
        }
        tool1.disabled= "true"
    }
    
    console.log(ans_cross)
     ans_cross.forEach((item)=>{
        console.log(item)
        crossAns =answers.querySelector(`input[value=${item}]`)
        crossAns.disabled = "true"
        crossAns.parentNode.style["text-decoration"] = "line-through"
    });
    //  //random get an incorrectAns
    //  var j=Math.floor(Math.random()*DataAns.length)
    //  cross1 = DataAns[j];
    //  DataAns.splice(j,1); // get rid of the first incorrectAns, prevent get 2 the same
    //  //random get the second incorrectAns
    //  var k=Math.floor(Math.random()*DataAns.length)
    //  cross2 = DataAns[k];

     //display cross-out answers
    //  console.log(cross1 , "&&" ,cross2)
    //  crossAns_1 =answers.querySelector(`input[value=${cross1}]`)
    //  crossAns_1.disabled = "true"
    //  crossAns_1.parentNode.style["text-decoration"] = "line-through"
    //  crossAns_2 =answers.querySelector(`input[value=${cross2}]`)
    //  crossAns_2.disabled = "true"
    //  crossAns_2.parentNode.style["text-decoration"] = "line-through"
    //  console.log(crossAns_1,crossAns_2)
     
     //disableed button _only allow this once per game
    
 }

//Tool2_ pause the timer for a question for 1 minute 
function Pause1min(){
    //pause the timer 
    clearInterval(counterInterval);
    //set new 1 minute timer
    loadTimer(60);
     //disableed button _only allow this once per game
    tool2.disabled= "true"
}




// ---Utility Functions ---

//replace HTML tag display correct texts
function HTMLDecode(textString){
    //The Open Trivial DB API
    //https://stackoverflow.com/questions/57074776/parse-html-string-to-dom-and-convert-it-back-to-string
    // let doc = new DOMParser().parseFromString(textString,"text/html");
    // return doc.documentElement.textContent;
    //The QuizAPI
    //https://jasonwatmore.com/vanilla-js-html-encode-in-javascript
    return textString
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


//check two array is the same
function CheckAnsArr(userAns, correctAns) {
    if (userAns.length !== correctAns.length) {
        return false;
    }
    for (let i = 0; i < userAns.length; i++) {
        if (userAns[i] !== correctAns[i]) {
            return false;
        }
    }
    return true;
}