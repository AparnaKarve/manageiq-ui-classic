class ApplicationHelper::Button::GenericObjectDefinitionCustomGroup < ApplicationHelper::Button::Basic
  def visible?
    # @god_node
    true
  end

  def disabled?
    # !@god_node
    false
  end
end
