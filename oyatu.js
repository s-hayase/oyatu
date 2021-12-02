let tabetaData = document.getElementById('tabeta-data');
let oyatuName = document.getElementById('oyatu-name');
let oyatuNedan = document.getElementById('oyatu-nedan');

let outputArea = document.getElementById('output-area');
let sumArea = document.getElementById('sum-area');

let nowtabledata = [];

  loadData();
  calcSum();

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
  save();
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
  nowtabledata.forEach(function (tdataRow,index) {
    let newRow = outputArea.querySelector('table tbody').insertRow(-1);
    newRow.setAttribute(`id`,`rowId${index}`);
    let newCell = outputArea.querySelector('table tbody tr:last-child').insertCell(-1);
    let checkbox = document.createElement("input");
    checkbox.type = 'checkbox';
    newCell.appendChild(checkbox);
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
  if(keys.length ===0){
    return;
  }
  let max = keys.reduce(function (a, b) {
    return Math.max(a, b);
  });
  nowtabledata = JSON.parse(localStorage.getItem(max));
  createTabel();
}

let delButton = document.getElementById('del');
delButton.addEventListener(`click`,()=> {
  if(document.querySelectorAll('table tbody tr input[type = checkbox]:checked').length === 0){
    alert('選択ボタンにチェックしてください');
    return;
  }
  if(!confirm('削除しても良いですか？')){
    return;
  }
  let checkbox = document.querySelectorAll('table tbody tr input[type = checkbox]');
  Array.from(checkbox,(e,i)=>{
    if(e.checked){
      document.querySelector('table tbody').deleteRow(i);
    }
  });
  nowtabledata = extractouputTabel();
  createTabel();
  calcSum();
  save();
});

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


function save(){
  localStorage.setItem(Date.now(), JSON.stringify(nowtabledata));
  alert('保存しました');
}

let modiButton = document.getElementById('modi');
modiButton.addEventListener(`click`,()=>{
  let checkbox = document.querySelectorAll('table tbody tr input[type = checkbox]');
  if(modiButton.innerText === `編集`){
  modiButton.innerText = `完了`;

  Array.from(checkbox,(e,i)=>{
    e.disabled= true;
    if(e.checked){
      let checkedRow = document.getElementById(`rowId${i}`).querySelectorAll(`td`);
      checkedRow[1].innerHTML = `<input type="date" id="id1" value=${checkedRow[1].innerText}>`;
      checkedRow[2].innerHTML = `<input type="text" id="id2" placeholder=${checkedRow[2].innerText}>`;
      checkedRow[3].innerHTML = `<input type="number" id="id3" placeholder=${checkedRow[3].innerText}>`;
    }
  });
  return;
  }
  if(modiButton.innerText === `完了`){
    let inputFlag = true;
    Array.from(checkbox,(e,i)=>{
      if(e.checked){
        let checkedRow = document.getElementById(`rowId${i}`).querySelectorAll(`td`);
        const id1 = document.querySelector(`#rowId${i} #id1`).value;
        const id2 = document.querySelector(`#rowId${i} #id2`).value;
        const id3 = document.querySelector(`#rowId${i} #id3`).value;
        if(id1.length === 0||id2.length === 0||id3.length === 0){
          inputFlag = false;
          return ;
        }
        checkedRow[1].innerHTML = `<td>${document.querySelector(`#rowId${i} #id1`).value}</td>`;
        checkedRow[2].innerHTML = `<td>${document.querySelector(`#rowId${i} #id2`).value}</td>`;
        checkedRow[3].innerHTML = `<td>${document.querySelector(`#rowId${i} #id3`).value}</td>`;
        e.checked = false;
      }
    });
    if(inputFlag !== true){
      alert(`未入力があります`);
      return ;
    }
    checkbox.forEach((e)=>{e.disabled= false;});
    nowtabledata = extractouputTabel();
    nowtabledata.sort(function (a, b) {
      return (a[0] > b[0] ? 1 : -1);
    });
    createTabel();
    calcSum();
    modiButton.innerText = `編集`;
    return;
  }
});