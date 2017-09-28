class ApplicationHelper::Button::GenericObjectDefinitionCustomGroup < ApplicationHelper::Button::Basic
  # def visible?
  #   @god_node
  # end

  def disabled?
    !@god_node
  end
end
