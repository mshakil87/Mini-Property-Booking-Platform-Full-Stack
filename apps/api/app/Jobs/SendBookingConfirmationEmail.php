<?php

namespace App\Jobs;

use App\Models\Booking;
use App\Mail\BookingConfirmationMail;
use App\Mail\AdminNewBookingMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

        // Send confirmation email to guest
        Mail::to($booking->user->email)->send(new BookingConfirmationMail($booking));

        // Send new booking notification email to admin
        $adminEmail = config('mail.from.address');
        Mail::to($adminEmail)->send(new AdminNewBookingMail($booking));

        Log::info('Separate booking emails sent to guest and admin', [
            'booking_id' => $booking->id,
            'guest_email' => $booking->user->email,
            'admin_email' => $adminEmail,
        ]);
    }
}

