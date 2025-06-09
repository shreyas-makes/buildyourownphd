class Flashcard < ApplicationRecord
  belongs_to :user
  belongs_to :content_chunk
end
