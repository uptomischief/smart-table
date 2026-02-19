import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  // 4 пункт шага 2
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // копируем для последующего изменения
  // @todo: использование
    // шаг 5 
  // result = applySearching(result, state, action);
    // шаг 4 пункт 1
  // result = applyFiltering(result, state, action);
  //   // шаг 3 пункт 2
  // result = applySorting(result, state, action);
  // // шаг 2 пункт 3
  // result = applyPagination(result, state, action);
  query = applyPagination(query, state, action); // обновляем query, шаг 2

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ['search', 'header', 'filter'], // пункт 1 шага 3  и   пункт 1 шага 4   и    шаг 5
    after: ["pagination"], // пункт 1 шага 2
  },
  render,
);

// @todo: инициализация
// шаг 2 пункт 2 + шаг 2 в спринт 2
const {applyPagination, updatePagination} = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

// // шаг 3 пункт 1
// const applySorting = initSorting([
//   // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
//   sampleTable.header.elements.sortByDate,
//   sampleTable.header.elements.sortByTotal,
// ]);

// // шаг 4 пункт 1
// const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
//     searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
// });

// // шаг 5
// const applySearching = initSearching('search');

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes(); //внутри init() получаем индексы
}

init().then(render);
