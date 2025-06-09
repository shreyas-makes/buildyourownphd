class CreateFlashcards < ActiveRecord::Migration[8.0]
  def change
    create_table :flashcards do |t|
      t.references :user, null: false, foreign_key: true
      t.references :content_chunk, null: false, foreign_key: true
      t.text :question
      t.text :answer
      t.datetime :review_at

      t.timestamps
    end
  end
end
