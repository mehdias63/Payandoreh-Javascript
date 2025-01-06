// http://localhost:3000/transactions
document.addEventListener('DOMContentLoaded', () => {
	const showContentBtn = document.querySelector('.show-content-btn')
	const mainContent = document.getElementById('main-content')

	showContentBtn.addEventListener('click', () => {
		mainContent.style.display = 'block'
		showContentBtn.style.display = 'none'
	})

	let transactions = []
	let filteredTransactions = []
	let isPriceSorted = true
	let isDateSorted = true

	axios
		.get('http://localhost:3000/transactions')
		.then(response => {
			transactions = response.data
			filteredTransactions = [...transactions]
			renderTransactions(filteredTransactions)
		})
		.catch(error => console.log('خطا در دریافت اطلاعات: ', error))

	document.getElementById('search').addEventListener('input', e => {
		const value = e.target.value.trim()
		filteredTransactions = transactions.filter(transaction =>
			transaction.refId.toString().includes(value),
		)
		renderTransactions(filteredTransactions)
	})

	document
		.getElementById('sort-price')
		.addEventListener('click', () => {
			filteredTransactions.sort((a, b) => {
				return isPriceSorted ? b.price - a.price : a.price - b.price
			})
			isPriceSorted = !isPriceSorted
			renderTransactions(filteredTransactions)
		})
	document
		.getElementById('sort-date')
		.addEventListener('click', () => {
			filteredTransactions.sort((a, b) => {
				return isDateSorted ? b.date - a.date : a.date - b.date
			})
			isDateSorted = !isDateSorted
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
		' ساعت ' +
		date.toLocaleTimeString('fa-IR')
	)
}
