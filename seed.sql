USE wecheck_db;

-- Clear any existing records to prevent duplicates during seeding
TRUNCATE TABLE check_ins;

-- Seed check-in 1: April 27, 2026
INSERT INTO check_ins (
    check_in_date,
    check_in_timestamp,
    mode,
    
    -- Connectedness
    c_scale,
    j_scale,
    c_most_connected,
    j_most_connected,
    c_distant,
    j_distant,
    
    -- Needs
    c_more_of,
    j_more_of,
    c_less_of,
    j_less_of,
    c_bothering,
    j_bothering,
    
    -- Appreciation
    c_feel_loved,
    j_feel_loved,
    c_grateful_quality,
    j_grateful_quality,
    c_appreciate_relationship,
    j_appreciate_relationship,
    
    -- Goals / Future
    c_goals_page,
    j_goals_page,
    c_goals_notes,
    j_goals_notes,
    c_future_worries,
    j_future_worries,
    c_excited,
    j_excited,
    
    -- Overview
    c_couple_status,
    j_couple_status,
    c_couple_overview_notes,
    j_couple_overview_notes,
    c_improve,
    j_improve,
    c_working_well,
    j_working_well
) VALUES (
    'Apr 27, 2026',
    1745748000000,
    'together',
    
    -- Connectedness
    8,
    7,
    'Cooking that pasta dish together on Friday night with jazz playing in the background.',
    'Our long, honest talk on the walk Saturday evening.',
    'When I was stressed on Tuesday and became a bit quiet and withdrawn.',
    'Felt a little disconnected when you were occupied with work stuff on Tuesday.',
    
    -- Needs
    'More little check-in texts during the day.',
    'More shared laughs and lighthearted moments.',
    'Less talking about work stressors late at night.',
    'Less overthinking small details.',
    'None at all.',
    'Was slightly hurt by a sarcastic comment on Wednesday, but we cleared it up.',
    
    -- Appreciation
    'You planning our Friday date night fully.',
    'You bringing me tea while I was reading on the couch.',
    'Your grounding presence. You calm my mind.',
    'Your enthusiasm and creative spark.',
    'Our emotional safety. I can tell you absolutely anything.',
    'Our friendship. You are truly my best friend.',
    
    -- Goals / Future
    TRUE,
    TRUE,
    'Fully aligned!',
    'Yes, looking forward to the future.',
    'None.',
    'A little worried about housing logistics, but we got this.',
    'Our upcoming weekend cabin getaway.',
    'Going to the farmer\'s market this Sunday.',
    
    -- Overview
    'Flowing Steady',
    'Flowing Steady',
    'A solid, gentle week.',
    'Felt very close and supportive.',
    'Expressing small irritations earlier before they build.',
    'Giving each other 10 minutes of winding-down space after work.',
    'Dividing household chores has been seamless lately.',
    'Our daily physical affection.'
);

-- Seed check-in 2: May 04, 2026
INSERT INTO check_ins (
    check_in_date,
    check_in_timestamp,
    mode,
    
    -- Connectedness
    c_scale,
    j_scale,
    c_most_connected,
    j_most_connected,
    c_distant,
    j_distant,
    
    -- Needs
    c_more_of,
    j_more_of,
    c_less_of,
    j_less_of,
    c_bothering,
    j_bothering,
    
    -- Appreciation
    c_feel_loved,
    j_feel_loved,
    c_grateful_quality,
    j_grateful_quality,
    c_appreciate_relationship,
    j_appreciate_relationship,
    
    -- Goals / Future
    c_goals_page,
    j_goals_page,
    c_goals_notes,
    j_goals_notes,
    c_future_worries,
    j_future_worries,
    c_excited,
    j_excited,
    
    -- Overview
    c_couple_status,
    j_couple_status,
    c_couple_overview_notes,
    j_couple_overview_notes,
    c_improve,
    j_improve,
    c_working_well,
    j_working_well
) VALUES (
    'May 04, 2026',
    1746352800000,
    'together',
    
    -- Connectedness
    9,
    9,
    'Our cabin getaway! No service, just walks, reading, cooking, and sleeping in. Magical.',
    'Sitting by the fireplace at the cabin, talking about everything and nothing.',
    'Honestly, barely felt any distance this week. It was wonderful.',
    'None. It was a very aligned week.',
    
    -- Needs
    'More adventures like this cabin trip throughout the year.',
    'More undivided attention times.',
    'Less structure, more going with the flow.',
    'Less worrying about email lists.',
    'None.',
    'None.',
    
    -- Appreciation
    'Your handmade card. I will keep it forever.',
    'You holding me close when we woke up to the sound of rain.',
    'Your beautiful empathy and listening ear.',
    'Your loyalty and strength. You make me feel safe.',
    'How easily we can play and laugh together.',
    'How we always come back together and reconcile quickly.',
    
    -- Goals / Future
    TRUE,
    TRUE,
    'Perfect harmony.',
    'Totally in sync.',
    'None.',
    'None.',
    'Going to that new outdoor dining spot on Thursday.',
    'Finishing our favorite show together.',
    
    -- Overview
    'Flowing Steady',
    'Flowing Steady',
    'An absolute high-vibration week.',
    'Felt so deeply unified and supported.',
    'Keeping our screen time down in the evenings.',
    'Remembering to take deep breaths when chores pile up.',
    'Making joint decisions together feels completely natural.',
    'Doing check-ins like this!'
);

-- Seed standalone self-appreciations
-- Carter reflections (shared and private)
INSERT INTO self_appreciations (author, reflection_date, reflection_timestamp, content, is_shared) VALUES
('carter', 'May 18, 2026', 1779084000000, 'I took 20 minutes to read quietly in the morning without feeling guilty or like I had to check my email immediately.', TRUE),
('carter', 'May 20, 2026', 1779256800000, 'I stood up for my creative time today and spent an hour painting, even though there were lots of chores waiting to be done.', FALSE),
('carter', 'May 24, 2026', 1779602400000, 'I set a very clear boundary with my client about work hours, ensuring I could fully unplug for the weekend.', TRUE);

-- Jurrand reflections (shared and private)
INSERT INTO self_appreciations (author, reflection_date, reflection_timestamp, content, is_shared) VALUES
('jurrand', 'May 19, 2026', 1779170400000, 'I allowed myself to take a long, relaxing nap without feeling like I was being lazy or unproductive.', TRUE),
('jurrand', 'May 21, 2026', 1779343200000, 'I stayed extremely patient with myself when my creative coding project didn’t build on the first attempt.', TRUE),
('jurrand', 'May 25, 2026', 1779688800000, 'I cooked a nourishing meal just for myself that I’ve been craving, taking the time to fully savor and enjoy it.', FALSE);
