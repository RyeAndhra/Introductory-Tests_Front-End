CARA MENJALANKAN :
- buka cmd pada folder dist
- npm install -g http-server (untuk menginstall http-server)
- npx json-server db.json (untuk menggunakan endpoint dummy)
- http-server (pada cmd berbeda, untuk menjalankan servernya)

Tampilan pertama akan langsung ada pada page 'Login', ada tombol 'Register' untuk membuat user baru
dimana akan mendapatkan role 'Admin' sebagai default. Sudah ada 3 user yang bisa digunakan yaitu 'Admin',
'Rye', dan 'Figo' dengan password '123'

Ada dua role yaitu 'Admin' dan 'User' dimana jika login sebagai Admin akan mengarah pada halaman Dashboard
dan jika login sebagai User akan mengarah pada halaman Home. Role bisa diganti pada selection User pada Home.