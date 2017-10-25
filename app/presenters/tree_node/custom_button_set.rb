module TreeNode
  class CustomButtonSet < Node
    set_attribute(:text) do
      if @options[:type] == :sandt
        _("%{button_group_name} (Group)") % {:button_group_name => @object.name.split("|").first}
      else
        @object.name.split("|").first
      end
    end

    set_attribute(:tooltip) do
      if @object.description
        _("Button Group: %{button_group_description}") % {:button_group_description => @object.description}
      else
        @object.name.split("|").first
      end
    end

    # set_attributes(:image, :icon) do
    #   if @object.picture
    #     image = @object.decorate.fileicon
    #   else
    #     icon = @object.decorate.fonticon
    #   end
    #   [image, icon]
    # end

    set_attribute(:color) { @object.set_data.try(:[], :button_color) }
  end
end
