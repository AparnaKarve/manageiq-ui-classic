class ApplicationHelper::Button::GenericObjectDefinitionDeleteButton < ApplicationHelper::Button::Basic
  def visible?
    @display != 'generic_objects'
  end

  def disabled?
    !@record.try(:generic_objects).try(:count).try(:zero?)
  end
end
