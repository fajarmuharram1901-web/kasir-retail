<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background: #f2f2f2; }
        .right { text-align: right; }
        .total { font-weight: bold; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h2>INVOICE</h2>
        <p>No: {{ $order->id }}<br>
           Tanggal: {{ $order->created_at->format('d/m/Y') }}<br>
           Pelanggan: {{ $order->customer_name }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Produk</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td class="right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                <td class="right">{{ $item->quantity }}</td>
                <td class="right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            @php($adjust = $order->total - $order->items->sum('subtotal'))
            @if ($adjust != 0)
            <tr>
                <td colspan="3" class="total">Diskon / Pajak / Biaya Lain</td>
                <td class="total">{{ $adjust < 0 ? '-' : '' }}Rp {{ number_format(abs($adjust), 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr>
                <td colspan="3" class="total">Grand Total</td>
                <td class="total">Rp {{ number_format($order->total, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>