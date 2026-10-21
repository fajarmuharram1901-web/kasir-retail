<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Daftar Produk</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        img { width: 64px; height: 64px; object-fit: cover; }
        .success { background: #e6f4ea; padding: 10px; margin-top: 12px; }
    </style>
</head>
<body>
    <h2>Daftar Produk</h2>
    <a href="{{ route('products.create') }}">+ Tambah Produk</a>

    @if (session('success'))
        <div class="success">{{ session('success') }}</div>
    @endif

    <table>
        <tr><th>Gambar</th><th>Nama</th><th>SKU</th><th>Harga</th><th>Stok</th></tr>
        @forelse ($products as $p)
            <tr>
                <td>@if ($p->image)<img src="{{ asset('storage/' . $p->image) }}" alt="{{ $p->name }}">@endif</td>
                <td>{{ $p->name }}</td>
                <td>{{ $p->sku }}</td>
                <td>Rp {{ number_format($p->price, 0, ',', '.') }}</td>
                <td>{{ $p->stock }}</td>
            </tr>
        @empty
            <tr><td colspan="5">Belum ada produk.</td></tr>
        @endforelse
    </table>
</body>
</html>
