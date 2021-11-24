let tabetaData = document.getElementById('tabeta-data');
let oyatuName = document.getElementById('oyatu-name');
let oyatuNedan = document.getElementById('oyatu-nedan');

let outputArea = document.getElementById('output-area');
let sumArea = document.getElementById('sum-area');

let nowtabledata = [];

if (confirm('読み込みますか？')) {
  loadData();
  calcSum();
}

let addButton = document.getElementById('add');
addButton.onclick = () => {
  let date = tabetaData.value;
  if (date.length === 0) {
    return;
  }

  let name = oyatuName.value;
  if (name.length === 0) {
    return;
  }

  let price = oyatuNedan.value;
  if (price.length === 0) {
    return;
  }

  let trdata = [date, name, price];
  nowtabledata.push(trdata);

  nowtabledata.sort(function (a, b) {
    return (a[0] > b[0] ? 1 : -1);
  });

  createTabel();
  calcSum();
};

function calcSum() {
  let sum = 0;
  nowtabledata.forEach(function (e) {
    const price = 2;
    sum = sum + parseInt(e[price]);
  })
  sumArea.innerHTML = '<p>今月おやつに使った金額は' + sum + '円です</p>';
}

function createTabel() {
  outputArea.querySelector('table tbody').innerText = "";
  nowtabledata.forEach(function (tdataRow) {
    let newRow = outputArea.querySelector('table tbody').insertRow(-1);
    let newCell = outputArea.querySelector('table tbody tr:last-child').insertCell(-1);
    let radiobutton = document.createElement("input");
    radiobutton.type = 'radio';
    newCell.appendChild(radiobutton);
    tdataRow.forEach(function (td) {
      let newCell = outputArea.querySelector('table tbody tr:last-child').insertCell(-1);
      newCell.appendChild(document.createTextNode(td));
    });
  });
}

function loadData() {
  let keys = [];
  for (key in localStorage) {
    if (key === 'weblioObjFlg') {
      localStorage.removeItem('weblioObjFlg');
    }
    if (localStorage.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  let max = keys.reduce(function (a, b) {
    return Math.max(a, b);
  });
  nowtabledata = JSON.parse(localStorage.getItem(max));
  createTabel();
}

let delButton = document.getElementById('del');
delButton.onclick = function () {
  if(document.querySelectorAll('table tbody tr input[type = radio]:checked').length === 0){
    alert('選択ボタンにチェックしてください');
    return;
  }
  if(!confirm('削除しても良いですか？')){
    return;
  }
  let radiobutton = document.querySelectorAll('table tbody tr input[type = radio]');
  let i =0;
    radiobutton.forEach(function(e) {
      if(e.checked){
        document.querySelector('table tbody').deleteRow(i);       
        return;
      }
      i++;
    });
  
  nowtabledata = extractouputTabel();
  createTabel();
  calcSum();
}

function extractouputTabel() {
  let table = [];
  for (let i = 0; i < document.querySelector('table tbody').rows.length; i++) {
    let row = [];
    row.push(document.querySelector('table tbody').rows[i].cells[1].textContent);
    row.push(document.querySelector('table tbody').rows[i].cells[2].textContent);
    row.push(document.querySelector('table tbody').rows[i].cells[3].textContent);
    table.push(row);
  }
  return table;
}

let saveButton = document.getElementById('save');
saveButton.onclick = function(){
  localStorage.setItem(Date.now(), JSON.stringify(nowtabledata));
  alert('保存しました');
}