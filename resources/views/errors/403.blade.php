@extends('errors.layout')
@section('title', '403 — Forbidden')
@section('content')
    <div class="max-w-md">
        <p class="text-sm font-black uppercase tracking-[0.14em] text-[#cc0000]">403</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Forbidden</h1>
        <p class="mt-3 text-sm leading-relaxed text-zinc-600">You don't have permission to access this resource.</p>
        <div class="mt-8">
            <a href="/" class="inline-flex rounded-sm bg-black px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-zinc-800">Go to homepage</a>
        </div>
    </div>
@endsection
