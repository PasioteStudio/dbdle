<form action="{!! $url !!}" {!! $attributes !!}>
    @csrf
    <button type="submit" class="{!! $basename !!}__link btn btn-warning">
        <span class="{!! $basename !!}__label">{{ $label }}</span>
    </button>
</form>
