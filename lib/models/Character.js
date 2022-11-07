const pool = require('../utils/pool');
const { Quote } = require('./Quote');

class Character {
  id;
  first_name;
  last_name;
  quotes;

  constructor(row) {
    this.id = row.id;
    this.first_name = row.first_name;
    this.last_name = row.last_name;
    this.quotes =
      row.quotes.length > 0 ? row.quotes.map((quote) => new Quote(quote)) : [];
  }

  static async getAll() {
    // implement getAll() method to return all characters with a list of quotes
    const { rows } = await pool.query(`
    select characters.*,
      coalesce(
        json_agg(to_jsonb(quotes))
        filter (WHERE quotes.id IS NOT NULL), '[]') as quotes
    from characters left join characters_quotes
      on characters.id = characters_quotes.characters_id
    left join quotes on quotes.id = characters_quotes.quotes_id
    group by characters.id
    `);
  }
}

module.exports = Character;
