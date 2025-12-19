<?php

namespace App\Jobs;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendBookingConfirmationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $bookingId)
    {
    }

    public function handle(): void
    {
        $booking = Booking::with(['user', 'property'])->find($this->bookingId);
        if (!$booking) {
            return;
        }
        Log::info('Sending booking confirmation email', [
            'booking_id' => $booking->id,
            'user_email' => $booking->user->email,
            'property' => $booking->property->title,
            'dates' => $booking->start_date->toDateString().' - '.$booking->end_date->toDateString(),
        ]);
    }
}

