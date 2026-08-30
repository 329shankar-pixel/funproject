@extends('errors.layout')
@section('title', '503 — Service Unavailable')
@section('content')
    <div class="max-w-md">
        <p class="text-sm font-black uppercase tracking-[0.14em] text-[#cc0000]">503</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900">Service Unavailable</h1>
        <p class="mt-3 text-sm leading-relaxed text-zinc-600">We're performing maintenance. Please check back shortly.</p>
        <div class="mt-8">
            <a href="/" class="inline-flex rounded-sm bg-black px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-zinc-800">Go to homepage</a>
        </div>
    </div>
@endsection
