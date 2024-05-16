"use strict";
var resultsFinal = [
    {"question": "Идентификаторы в JavaScript должны начинаться с:", "answer": ["знака процента (%)", "буквы"]},
    {"question": "Структура HTML-документа включает в себя:", "answer": ["скрипты", "параметры"]},
    {"question": "Массивы в JavaScript могут работать как:", "answer": ["граф", "двоичное дерево поиска"]}
];

function levenshtein(s1, s2, costs) {
    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;
    costs = costs || {};
    var cr = costs.replace || 1;
    var cri = costs.replaceCase || costs.replace || 1;
    var ci = costs.insert || 1;
    var cd = costs.remove || 1;
    cutHalf = flip = Math.max(l1, l2);
    var minCost = Math.min(cd, ci, cr);
    var minD = Math.max(minCost, (l1 - l2) * cd);
    var minI = Math.max(minCost, (l2 - l1) * ci);
    var buf = new Array(cutHalf * 2 - 1);
    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }
    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();
        buf[flip] = (i + 1) * minI;
        ii = flip;
        ii2 = cutHalf - flip;
        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = ch === s2[j] ? 0 : chl === s2[j].toLowerCase() ? cri : cr;
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
}

var questions = document.getElementsByClassName('que');
var answersString = '/';
var oldPathname = window.location.pathname + window.location.search;
var flag = true;
document.addEventListener('keypress', function (e) {
    e.preventDefault();
    if (flag) {
        history.pushState(null, null, oldPathname);
    } else {
        history.pushState(null, null, answersString);
    }
    flag = !flag;
});

[].forEach.call(questions, function (question, questionIndex) {
    var questionText = question.getElementsByClassName("qtext")[0].innerText;
    var qustionObjectFromResults = resultsFinal.filter(function (item) {
        return levenshtein(item.question.toLowerCase().trim(), questionText.toLowerCase().trim()) < 3;
    });
    var answers = qustionObjectFromResults.length ? qustionObjectFromResults.map(function (item) {
        return item.answer;
    }) : [];
    if (!answers.length) {
        console.log(questionIndex + 1, questionText);
    }
    var answerOptions = question.querySelectorAll(".answer>div");
    var rightOptions = '';
    [].forEach.call(answerOptions, function (elem, index) {
        var optionText = elem.getElementsByTagName('div')[0].innerText;
        answers.forEach(function (answer) {
            answer.forEach(function (a) {
                if (a.toLowerCase().trim() === optionText.toLowerCase().trim()) {
                    rightOptions += index + 1;
                }
            });
        });
    });
    if (rightOptions === '') {
        console.log(answers);
        console.log(answers.join(';'));
        console.log(answers.join(';').match(/((?<=\s|^)[А-Яа-яA-Za-z])|(;)/g));
        rightOptions = (answers.join('; '));
        console.log(rightOptions);
