TextualNoValue = Struct.new(:title, :items) do
  def template
    'shared/summary/textual_no_value'
  end

  def locals
    {:title => title, :items => items}
  end
end
