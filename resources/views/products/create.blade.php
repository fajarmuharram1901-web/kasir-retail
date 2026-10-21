<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tambah Produk</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 480px; margin: 40px auto; padding: 0 16px; }
        label { display: block; margin-top: 12px; font-weight: 600; }
        input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
        button { margin-top: 16px; padding: 10px 16px; }
        .error { color: #b00020; font-size: 14px; }
    </style>
</head>
<body>
    <h2>Tambah Produk</h2>
    <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <label>Nama</label>
        <input type="text" name="name" value="{{ old('name') }}">
        @error('name')<div class="error">{{ $message }}</div>@enderror

        <label>SKU</label>
        <input type="text" name="sku" value="{{ old('sku') }}">
        @error('sku')<div class="error">{{ $message }}</div>@enderror

        <label>Harga</label>
        <input type="number" name="price" value="{{ old('price') }}">
        @error('price')<div class="error">{{ $message }}</div>@enderror

        <label>Stok</label>
        <input type="number" name="stock" value="{{ old('stock', 0) }}">
        @error('stock')<div class="error">{{ $message }}</div>@enderror

        <label>Deskripsi</label>
        <textarea name="description" rows="3">{{ old('description') }}</textarea>

        <label>Gambar (maks 2 MB)</label>
        <input type="file" name="image" accept="image/*">
        @error('image')<div class="error">{{ $message }}</div>@enderror

        <button type="submit">Simpan</button>
        <a href="{{ route('products.index') }}">Kembali</a>
    </form>
</body>
</html>
