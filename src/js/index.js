// http://localhost:3000/transactions
let isPriceSortedAsc = true
let isDateSortedAsc = true
let activeSort = ''

document.addEventListener('DOMContentLoaded', () => {
	const showContentBtn = document.querySelector('.show-content-btn')
	const mainContent = document.getElementById('main-content')
	const searchInput = document.getElementById('search')
	const sortPrice = document.getElementById('sort-price')
	const sortDate = document.getElementById('sort-date')

	showContentBtn.addEventListener('click', () => {
		mainContent.classList.remove('hidden')
		searchInput.classList.remove('hidden')
		showContentBtn.classList.add('hidden')
		fetchTransactions()
	})

	searchInput.addEventListener('input', e => {
		fetchTransactions(e.target.value)
	})

	sortPrice.addEventListener('click', () => {
		isPriceSortedAsc = !isPriceSortedAsc
		activeSort = 'price'
		fetchTransactions(searchInput.value)
		updateIconRotation(sortPrice, isPriceSortedAsc)
	})

	sortDate.addEventListener('click', () => {
		isDateSortedAsc = !isDateSortedAsc
		activeSort = 'date'
		fetchTransactions(searchInput.value)
		updateIconRotation(sortDate, isDateSortedAsc)
	})
})

function fetchTransactions(query = '') {
	let url = `http://localhost:3000/transactions?refId_like=${query}`
	if (activeSort === 'price') {
		url += `&_sort=price&_order=${isPriceSortedAsc ? 'asc' : 'desc'}`
	} else if (activeSort === 'date') {
		url += `&_sort=date&_order=${isDateSortedAsc ? 'asc' : 'desc'}`
	}

	axios
		.get(url)
		.then(response => {
			renderTransactions(response.data)
		})
		.catch(error => console.log('خطا در دریافت اطلاعات: ', error))
}

function renderTransactions(data) {
	const transactionBody = document.getElementById('transactions-body')
	transactionBody.innerHTML = ''

	if (data.length === 0) {
		transactionBody.innerHTML = `<div class='text-error'>هیچ تراکنشی یافت نشد</div>`
	}

	data.forEach((transaction, index) => {
		const result = document.createElement('div')
		result.classList.add('transaction-row')
		result.innerHTML = `
      <span class='transaction-text'>${index + 1}</span>
      <span class="transaction-text ${
				transaction.type === 'برداشت از حساب' ? 'error' : 'success'
			}">
        ${transaction.type}
      </span>
      <span class='transaction-text'>${transaction.price.toLocaleString(
				'fa-IR',
			)}</span>
      <span class='transaction-text'>${transaction.refId}</span>
      <span class='transaction-text'>${formatDate(
				transaction.date,
			)}</span>
    `
		transactionBody.appendChild(result)
	})
}

function updateIconRotation(element, isAsc) {
	const icon = element.querySelector('.icon')
	if (isAsc) {
		icon.classList.remove('rotate')
	} else {
		icon.classList.add('rotate')
	}
}

function formatDate(timestamp) {
	const date = new Date(timestamp)
	return (
		date.toLocaleDateString('fa-IR') +
		'&nbsp' +
		' ساعت ' +
		'&nbsp' +
		date.toLocaleTimeString('fa-IR', {
			hour: '2-digit',
			minute: '2-digit',
		})
	)
}
