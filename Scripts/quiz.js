//Dictionary of constant variables
const appState = {
    name : '',
    quiz_num : '',
    correct: 0,
    total: 9,
    question_num: 0,
}

//Dictionary of information about current question.

document.addEventListener('DOMContentLoaded', function(){
    //Loads introductory template asking for name and quiz selection

    load_view('#start', '#view-widget');


    document.querySelector('#quiz-select').onsubmit = function()
    {
        //Get quiz number and name
        appState.name = document.querySelector('#name').value;
        let temp = document.getElementsByName('quiz')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                appState.quiz_num = temp[i].value;
            }
        }

        //Load quiz view
        load_quiz_view();

    }
})

function load_quiz_view()
{
    let vars = {
        correct: appState.correct,
        total: appState.total
    }
    load_view('#quiz-view', '#view-widget', vars)
    load_question();
}

async function load_question()
{
    //Check to see if quiz is done
    console.log(appState.question_num);
    if (appState.question_num === appState.total)
    {
        finish_quiz();
    }
    //Get question
    const question = await get_quiz_info(appState.quiz_num, appState.question_num);
    //Load appropriate question template with info from async call.
    if (question["Type"] === "Text")
    {
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"]
        }
        load_view('#text-question', '#question-view', vars)
    }
    else if (question["Type"] === "SC")
    {
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"],
            choice1: question["Choice1"],
            choice2: question["Choice2"],
            choice3: question["Choice3"]
        }
        load_view('#sc-question', '#question-view', vars)
    }
    else if (question["Type"] === "MC")
    {
        let vars = {
            current_question: question["Question_Num"],
            question: question["Question"],
            choice1: question["Choice1"],
            choice2: question["Choice2"],
            choice3: question["Choice3"],
            choice4: question["Choice4"]
        }
        load_view('#mc-question', '#question-view', vars)
    }
    else if (question["Type"] === "Blank")
    {
        let vars = {
            current_question: question["Question_Num"],
            question_1: question["Question_1"],
            question_2: question["Question_2"]
        }
        load_view('#blank-question', '#question-view', vars)
    }
}


async function check_answer(q_type)
{
    const question = await get_quiz_info(appState.quiz_num, appState.question_num);

    if (q_type === 'text')
    {
        let user_answer = document.querySelector('#answer').value;
        if (user_answer === question["Answer"])
        {
            correct();
        }
        else
        {
            wrong();
        }
    }
    else if (q_type === 'SC')
    {
        var answer;
        let temp = document.getElementsByName('choice')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                 answer = temp[i].value;
            }
        }
        if (answer === question["Answer"])
        {
            correct();
        }
        else
        {
            wrong();
        }
    }
    else if (q_type === 'MC')
    {
        var answer = [];
        let temp = document.getElementsByName('choice')
        for(i=0; i<temp.length; i++)
        {
            if(temp[i].checked)
            {
                answer.push(parseInt(temp[i].value));
            }
        }
        var count = 0;
        for(i=0; i<answer.length; i++)
        {
            if(answer[i] === question["Answer"][i])
            {
                count++;
                console.log(question["Answer"].length);
            }
        }
        console.log(count);
        if(count === question["Answer"].length)
        {
            correct();
        }
        else
        {
            wrong();
        }

    }
    else if (q_type === 'Blank')
    {
        let user_answer = document.querySelector('#answer').value;
        if (user_answer === question["Answer"])
        {
            correct();
        }
        else
        {
            wrong();
        }
    }

    function correct()
    {
        load_view('#right', '#result');
        appState.correct++;
        appState.question_num++;
        setTimeout(load_quiz_view, 1000);
    }
    function wrong()
    {
        let vars = {
            explanation: question['Explanation']
        }
        load_view('#explanation', '#result', vars);
        appState.question_num++;
    }
}


function finish_quiz()
{
    var score = (appState.correct/appState.total).toFixed(1) * 100;
    let vars = {
        name : appState.name,
        correct: appState.correct,
        total: appState.total,
        score: score + '%'
    }
    if(appState.correct >= appState.total * 0.8)
    {
        //Passed message.
        load_view('#passed', '#view-widget', vars);
    }
    else
    {
        //Failed message.
        load_view('#failed', '#view-widget', vars);
    }
}

async function get_quiz_info(quiz_num, question_num)
{
    try {
        const response = await fetch('https://my-json-server.typicode.com/hershil007/CUS1172_Assignment3/' + quiz_num);
        const result = await response.json();
        return result[question_num];
    }catch(err)
    {
        console.log("Error");
    }

}

function load_view(target, replace, vars)
{
    var source = document.querySelector(target).innerHTML;
    var template = Handlebars.compile(source);
    var html = template(vars);
    document.querySelector(replace).innerHTML = html;
}
