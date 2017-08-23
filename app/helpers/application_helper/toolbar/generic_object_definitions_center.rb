class ApplicationHelper::Toolbar::GenericObjectDefinitionsCenter < ApplicationHelper::Toolbar::Basic
  button_group('generic_object_definition', [
    select(
      :generic_object_definition_configuration,
      'fa fa-cog fa-lg',
      t = N_('Configuration'),
      t,
      :items => [
        button(
          :generic_object_definition_new,
          'pficon pficon-add-circle-o fa-lg',
          t = N_('Add a new Generic Object Class'),
          t),
        button(
          :generic_object_definition_edit,
          'pficon pficon-edit fa-lg',
          t = N_('Edit Selected Generic Class'),
          t,
          :enabled   => false,
          :onwhen => "1",
          :url => "edit"),
        button(
          :generic_object_definition_delete,
          'pficon pficon-delete fa-lg',
          t = N_('Remove selected Generic Object Classes from Inventory'),
          t,
          :url_parms => "delete",
          :enabled   => false,
          :onwhen => "1+",
          :confirm   => N_("Warning: The selected Generic Object Classes will be permanently removed!")),
      ]
    )
  ])
end
