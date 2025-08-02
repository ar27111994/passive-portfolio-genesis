CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
  user_email TEXT,
  user_name TEXT,
  user_interests TEXT[]
)
RETURNS JSONB AS $$
DECLARE
  subscriber newsletter_subscribers;
BEGIN
  -- Check for valid email format
  IF user_email IS NULL OR user_email !~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid email format.');
  END IF;

  -- Attempt to insert the new subscriber
  BEGIN
    INSERT INTO public.newsletter_subscribers (email, name, interests, status, source)
    VALUES (user_email, user_name, user_interests, 'active', 'Website')
    RETURNING * INTO subscriber;

    RETURN jsonb_build_object('success', true, 'message', 'Successfully subscribed!', 'data', to_jsonb(subscriber));
  EXCEPTION
    WHEN unique_violation THEN
      -- If the email already exists, check their status
      SELECT * INTO subscriber FROM public.newsletter_subscribers WHERE email = user_email;
      IF subscriber.status = 'active' THEN
        RETURN jsonb_build_object('success', false, 'message', 'This email is already subscribed.');
      ELSE
        -- If they are unsubscribed, re-subscribe them
        UPDATE public.newsletter_subscribers
        SET status = 'active', name = user_name, interests = user_interests
        WHERE email = user_email
        RETURNING * INTO subscriber;
        RETURN jsonb_build_object('success', true, 'message', 'Welcome back! You have been re-subscribed.', 'data', to_jsonb(subscriber));
      END IF;
    WHEN OTHERS THEN
      -- Catch any other errors
      RETURN jsonb_build_object('success', false, 'message', 'An unexpected error occurred.');
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
