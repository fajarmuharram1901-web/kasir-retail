<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function kasir()
    {
        $products = Product::orderBy('name')->get()->map(fn ($p) => [
            'id'      => $p->id,
            'code'    => $p->sku,
            'barcode' => $p->sku,
            'name'    => $p->name,
            'price'   => $p->price,
        ]);

        return view('kasir', compact('products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name'    => 'nullable|string|max:255',
            'total'            => 'required|integer|min:0',
            'items'            => 'required|array|min:1',
            'items.*.id'       => 'required|exists:products,id',
            'items.*.qty'      => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($data) {
            $order = Order::create([
                'customer_name' => $data['customer_name'] ?: 'Umum',
                'total'         => $data['total'],
            ]);

            foreach ($data['items'] as $row) {
                $product = Product::findOrFail($row['id']);
                $order->items()->create([
                    'product_id' => $product->id,
                    'price'      => $product->price,
                    'quantity'   => $row['qty'],
                    'subtotal'   => $product->price * $row['qty'],
                ]);
            }

            return $order;
        });

        return response()->json([
            'id'          => $order->id,
            'invoice_url' => route('orders.invoice', $order),
        ]);
    }

    public function invoice(Order $order)
    {
        $order->load('items.product');

        $pdf = Pdf::loadView('invoices.invoice', ['order' => $order]);

        return $pdf->download('invoice_' . $order->id . '.pdf');
    }
}