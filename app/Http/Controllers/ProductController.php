<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->get();
        return view('products.index', compact('products'));
    }

    public function create()
    {
        return view('products.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'sku'         => 'required|string|max:100|unique:products,sku',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // max 2MB
        ]);

        $file = $request->file('image');

        if ($file) {
            $original = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $ext      = strtolower($file->getClientOriginalExtension());
            $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\-_]/', '_', $original) . '.' . $ext;
            $path     = 'products/' . $filename;

            $manager = new ImageManager(Driver::class);

            // resize + crop 800x800
            $image = $manager->decodePath($file->getRealPath())->cover(800, 800);

            $encoded = $ext === 'png'
                ? $image->encodeUsingFileExtension('png')
                : $image->encodeUsingFileExtension('jpg', quality: 85);

            Storage::disk('public')->put($path, $encoded->toString());

            $data['image'] = $path;
        }

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Produk ditambahkan');
    }
}
