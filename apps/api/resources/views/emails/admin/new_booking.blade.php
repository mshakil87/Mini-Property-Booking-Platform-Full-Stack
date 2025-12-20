<x-mail::message>
# New Booking Notification

A booking has been confirmed for **{{ $booking->property->title }}**.

**Booking Details:**
- **Property:** {{ $booking->property->title }}
- **Guest Name:** {{ $booking->guest_name ?? $booking->user->name }}
- **Guest Email:** {{ $booking->guest_email ?? $booking->user->email }}
- **Check-in:** {{ $booking->start_date->format('M d, Y') }}
- **Check-out:** {{ $booking->end_date->format('M d, Y') }}
- **Total Revenue:** ${{ number_format($booking->total_price, 2) }}

<x-mail::button :url="config('app.url') . '/admin/bookings'">
Manage Bookings
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
