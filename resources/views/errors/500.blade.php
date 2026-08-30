@extends('errors.layout')
@section('title', '500 — Server Error')
@section('content')
    <div class="max-w-md">
        <p class="text-sm font-black uppercase tracking-[0.14em] text-[#cc0000]">500</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Server error</h1>
        <p class="mt-3 text-sm leading-relaxed text-zinc-600">Something went wrong on our end. Please try again later.</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/" class="inline-flex rounded-sm bg-black px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-zinc-800">Go to homepage</a>
            <a href="javascript:location.reload()" class="inline-flex rounded-sm border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-zinc-50">Reload</a>
        </div>
    </div>
@endsection
