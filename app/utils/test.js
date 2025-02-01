const data = {
	nom : "koulibaly",
	prenom : "amadou",
	age : 12,
	categories : [1, 2, 3, 4, 5]
}

fetch('http://localhost:8001/accounts/test/', {
	method: 'POST',
	body: JSON.stringify(data),
	headers: {
		'Content-Type': 'application/json'
	}
})
	.then(res => res.json())
	.then(res => console.log(res))
	.catch(err => console.log(err))
	.finally(()=>{})

console.log(data)
console.log(JSON.stringify(data))