FactoryBot.define do
  factory :flashcard do
    user { nil }
    content_chunk { nil }
    question { "MyText" }
    answer { "MyText" }
    review_at { "2025-06-09 12:11:17" }
  end
end
