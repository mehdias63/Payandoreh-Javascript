// http://localhost:3000/transactions
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
	})

	let transactions = []
	let filteredTransactions = []
	let isPriceSortedAsc = true
	let isDateSortedAsc = true

	axios
		.get('http://localhost:3000/transactions')
		.then(response => {
			transactions = response.data
			filteredTransactions = [...transactions]
			renderTransactions(filteredTransactions)
		})
		.catch(error => console.log('خطا در دریافت اطلاعات: ', error))

	searchInput.addEventListener('input', e => {
		const value = e.target.value.trim()
		filteredTransactions = transactions.filter(transaction =>
			transaction.refId.toString().includes(value),
		)
		renderTransactions(filteredTransactions)
	})
	sortPrice.addEventListener('click', e => {
		filteredTransactions.sort((a, b) => {
			return isPriceSortedAsc ? b.price - a.price : a.price - b.price
		})
		isPriceSortedAsc = !isPriceSortedAsc
		const icon = e.target
			.closest('#sort-price')
			.querySelector('.icon')
		icon.classList.toggle('rotate')
		renderTransactions(filteredTransactions)
	})
	sortDate.addEventListener('click', e => {
		filteredTransactions.sort((a, b) => {
			return isDateSortedAsc ? b.date - a.date : a.date - b.date
		})
		isDateSortedAsc = !isDateSortedAsc
		const icon = e.target.closest('#sort-date').querySelector('.icon')
		icon.classList.toggle('rotate')
		renderTransactions(filteredTransactions)
	})
})

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
