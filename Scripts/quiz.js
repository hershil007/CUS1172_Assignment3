//Dictionary of constant variables
const appState = {
    name : '',
    quiz_num : 0,
    correct: 0,
    total: 20,
    question_num: 0,
}

const currentQuestion = {
    current_question_answer: '',
    explanation: '2+2 is the addition of 2 and 2, thus it equals 4.'
}

document.addEventListener('DOMContentLoaded', function(){
    //Loads introductory template asking for name and quiz selection
    var source = document.querySelector("#start").innerHTML;
    var template = Handlebars.compile(source);
    var html = template();
    document.querySelector("#view-widget").innerHTML = html;




    document.querySelector('#quiz-select').onsubmit = function()
    {
        //Get quiz number and name
        appState.name = document.querySelector('#name').value;
        let temp = document.getElementsByName('quiz')
        for(i=0; i<temp.length;i++)
        {
            if(temp[i].checked)
            {
                appState.quiz_num = temp[i].value;
            }
        }
        alert(appState.name)

        load_quiz();
    }
})

function load_quiz()
{
    var source = document.querySelector("#quiz-view").innerHTML;
    var template = Handlebars.compile(source);
    var html = template({correct: appState.correct, total: appState.total});
    document.querySelector("#view-widget").innerHTML = html;
    load_question();
}

function load_question()
{
    if (currentQuestion.question_num === appState.total)
    {
        finish_quiz();
    }
    appState.question_num += 1;
    //Make async call to get next question.  Pass in quiz_num and question_num
    let model = {
        Type: 'Text',
        Question: "What is 2+2?",
        Answer: '4'
    }
    //Load appropriate question template with info from async call.
    if (model.Type === 'Text')
    {
        var source = document.querySelector("#text-question").innerHTML;
        var template = Handlebars.compile(source);
        var html = template({current_question: appState.current_question, question: model.Question});
        document.querySelector("#question-view").innerHTML = html;
        currentQuestion.current_question_answer = model.Answer;
    }
    else if (model.Type === 'Multiple Choice')
    {
        var source = document.querySelector("#mc-question").innerHTML;
        var template = Handlebars.compile(source);
        var html = template({current_question: appState.current_question, question: model.Question});
        document.querySelector("#question-view").innerHTML = html;
    }
}


function check_answer(q_type)
{
    if (q_type === 'text')
    {
        let user_answer = document.querySelector('#answer').value;
        if (user_answer === currentQuestion.current_question_answer)
        {
            var source = document.querySelector("#right").innerHTML;
            var template = Handlebars.compile(source);
            var html = template();
            document.querySelector("#result").innerHTML = html;
            appState.correct += 1;
            setTimeout(load_question, 1000);

        }
        else
        {
            var source = document.querySelector("#explanation").innerHTML;
            var template = Handlebars.compile(source);
            var html = template({explanation: currentQuestion.explanation});
            document.querySelector("#result").innerHTML = html;
        }
    }
}


function finish_quiz()
{
    if(appState.correct >= appState.total * 0.8)
    {
        //Passed message.  Include name and score and redirect to main page.
    }
    else
    {
        //Failed message.  Include name and score and redirect to main page.
    }
}
