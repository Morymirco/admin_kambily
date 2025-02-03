const dataRef = {
	id: id,
	name: 'Mamadou Diallo',
	photo: '/deliverers/photo.jpg',
	phone: '+224 621 00 00 00',
	email: 'mamadou.diallo@example.com',
	zone: 'Ratoma',
	status: 'active',
	availability: 'available',
	rating: 4.8,
	joinDate: '2023-12-01',
	stats: {
		totalDeliveries: 145,
		thisMonth: 28,
		onTimeRate: 98,
		cancelRate: 2,
		totalEarnings: 2900000
	},
	recentDeliveries: [
		{
			id: 1,
			orderId: 'CMD-001',
			date: '2024-03-15',
			customer: 'Aissatou Barry',
			amount: 250000,
			status: 'delivered',
			rating: 5
		},
		// ... autres livraisons
	],
	performance: {
		monthly: [
			{ month: 'Jan', deliveries: 32, earnings: 640000 },
			{ month: 'Fév', deliveries: 28, earnings: 560000 },
			{ month: 'Mar', deliveries: 35, earnings: 700000 },
		],
		ratings: {
			5: 85,
			4: 12,
			3: 2,
			2: 1,
			1: 0
		}
	}
}