defmodule Codebattle.Tournament do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Codebattle.Tournament.Types

  @derive {Poison.Encoder, only: [:id, :name, :state, :starts_at, :players_count, :data]}

  @states ~w(waiting_participants canceled active finished)
  @starts_at_types ~w(1_min 5_min 10_min 30_min)

  schema "tournaments" do
    field(:name, :string)
    field(:state, :string, default: "waiting_participants")
    field(:players_count, :integer, default: 16)
    field(:starts_at, :naive_datetime)
    field(:starts_at_type, :string, virtual: true, default: "5_min")
    embeds_one(:data, Types.Data, on_replace: :delete)

    belongs_to(:creator, Codebattle.User)

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :state, :starts_at, :players_count, :creator_id])
    |> cast_embed(:data)
    |> validate_required([:name, :players_count, :creator_id])
    |> validate_inclusion(:state, @states)
    |> validate_inclusion(:starts_at_type, @starts_at_types)
  end

  def get!(id) do
    Codebattle.Repo.get!(Codebattle.Tournament, id)
  end

  def all() do
    query =
      from(
        t in Codebattle.Tournament,
        order_by: [desc: t.inserted_at],
        preload: :creator
      )

    Codebattle.Repo.all(query)
  end

  def starts_at_types, do: @starts_at_types
end