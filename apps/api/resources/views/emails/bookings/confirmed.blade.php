<x-mail::message>
# Booking Confirmation

Hi {{ $booking->user->name }},

Great news! Your booking for **{{ $booking->property->title }}** has been confirmed.

**Booking Details:**
- **Property:** {{ $booking->property->title }}
- **Check-in:** {{ $booking->start_date->format('M d, Y') }}
- **Check-out:** {{ $booking->end_date->format('M d, Y') }}
- **Total Price:** ${{ number_format($booking->total_price, 2) }}

<x-mail::button :url="config('app.url') . '/my-bookings'">
View My Bookings
</x-mail::button>

If you have any questions, feel free to contact us.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
